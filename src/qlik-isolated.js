var qlikIsolated = (function () {
    var qlik;
    var qlikServerBaseUrl;
    var qlikServerPrefix;
    var SINGLE_URL_APPID_PLACEHOLDER = '#APPID#';
    var SINGLE_URL_OBJ_PLACEHOLDER = '#OBJ#';
    var SINGLE_URL_OPT_PLACEHOLDER = '#OPT#';
    var SINGLE_URL_SHEET_PLACEHOLDER = '#SHEET#';
    var SINGLE_URL_OPT_SELECTION_BAR = 'currsel,';
    var SINGLE_URL_OPT_NO_INTERACTION = 'nointeraction,';
    var SINGLE_URL_OPT_NO_SELECTION = 'noselections,';
    var SINGLE_URL_OPT_NO_ANIMATION = 'noanimate,';
    var SINGLE_URL_CLEAR_SELECTION = '&select=clearall';
    var SINGLE_URL = '/single/?appid=' + SINGLE_URL_APPID_PLACEHOLDER
        + '&obj=' + SINGLE_URL_OBJ_PLACEHOLDER
        + '&sheet=' + SINGLE_URL_SHEET_PLACEHOLDER
        + '&opt=' + SINGLE_URL_OPT_PLACEHOLDER;

    var resolve;
    var reject;

    /**
     * Load Qlik in an isolated context
     * @param {string} qlikServerUrl Qlik Server base url
     * @param {string} [prefix='/'] Qlik Server prefix for resources folder
     * @return {Promise} Promise that gets resolved when qlik sense is successfully loaded
     */
    function getQlik(qlikServerUrl, prefix) {
        if (!qlikServerUrl)
            throw 'qlik-Isolated: Qlik Server URL is required';

        var p = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });

        if (qlik) {
            resolve(qlik);
            return p;
        }

        qlikServerBaseUrl = qlikServerUrl;
        qlikServerPrefix = prefix || '/';

        // create an iframe for an isolated context
        var qFrame = document.createElement('iframe');
        qFrame.style.display = 'none';
        qFrame.id = 'qFrame';
        document.body.appendChild(qFrame);
        qFrame.contentWindow.document.open();
        qFrame.contentWindow.document.write(getQFrameHtml());
        qFrame.contentWindow.document.close();

        return p;
    }

    function getQFrameHtml() {
        var jsUrl = qlikServerBaseUrl + qlikServerPrefix + 'resources';

        return '<html>'
            + '<head>'
            + '<script src="' + jsUrl + '/assets/external/requirejs/require.js"></script>'
            + '</head>'
            + '<body><p>Isolated iframe to load Qlik.js </p>'
            + '<script>'
            + 'try {'
            + 'require.config({ baseUrl: "' + jsUrl + '" });'
            + 'require(["js/qlik"], function(q) { parent.qlikIsolated._qFrameLoadSuccess(q); });'
            + '} catch(e) { parent.qlikIsolated._qFrameLoadFailure(e); }'
            + '</script>'
            + '</body>'
            + '</html>';
    }

    function _qFrameLoadSuccess(q) {
        qlik = q;
        resolve(qlik);
    }

    function _qFrameLoadFailure(e) {
        reject(e);
    }

    function getObjectIsolated(element, appid, obj, sheet, baseUrl,
                               showSelectionBar, clearSelection, disableInteraction,
                               disableSelection, disableAnimation, selections) {
        if(!element)
            throw 'qlik-Isolated: element must be a HTML element or a jQuery selection';

        if (typeof appid !== 'string')
            throw 'qlik-Isolated: appid must be a vaild string';
        
        if ((typeof obj !== 'string') && (typeof sheet !== 'string'))
            throw 'qlik-Isolated: obj or sheet must be a vaild string';

        // form Qlik Sense Single integration URL
        var url = baseUrl || qlikServerBaseUrl;
        if(!url)
            throw 'qlik-Isolated: baseUrl is required';

        var options = '';
        options += showSelectionBar ? SINGLE_URL_OPT_SELECTION_BAR : '';
        options += disableInteraction ? SINGLE_URL_OPT_NO_INTERACTION : '';
        options += disableAnimation ? SINGLE_URL_OPT_NO_ANIMATION : '';
        options += disableSelection ? SINGLE_URL_OPT_NO_SELECTION : '';
        options = options. substring(0, options.lastIndexOf(','));

        url += SINGLE_URL
            .replace(SINGLE_URL_APPID_PLACEHOLDER, appid)
            .replace(SINGLE_URL_OBJ_PLACEHOLDER, obj)
            .replace(SINGLE_URL_OPT_PLACEHOLDER, options)
            .replace(SINGLE_URL_SHEET_PLACEHOLDER, sheet);

        if(clearSelection)
            url += SINGLE_URL_CLEAR_SELECTION;

        if(selections)
            url += '&select=' + selections;

        // add iframe to single integration URL
        var singleIntegrationFrame = document.createElement('iframe');
        singleIntegrationFrame.style.border = 'none';
        singleIntegrationFrame.style.width = '100%';
        singleIntegrationFrame.style.height = '100%';
        singleIntegrationFrame.className = 'qlik-isolated';
        singleIntegrationFrame.src = url;
        element.append(singleIntegrationFrame);
    }

    function getSelectionBarIsolated(element, appid, baseUrl, clearSelection, disableInteraction,
                               disableSelection, disableAnimation, selections){
        getObjectIsolated(element,appid,'CurrentSelections', '', baseUrl, false, clearSelection,
                                disableInteraction, disableSelection, disableAnimation, selections);
    }

    return {
        getQlik: getQlik,
        getObjectIsolated: getObjectIsolated,
		getSelectionBarIsolated: getSelectionBarIsolated,
		_qFrameLoadSuccess: _qFrameLoadSuccess,
        _qFrameLoadFailure: _qFrameLoadFailure
    };
})();