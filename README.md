# qlik-isolated

Load Qlik Sense's qlik.js in an isolated, non-conflicting way and embed Qlik Sense objects into your web page

### Use case
* you want reference to qlik.js' qlik object to access the [App API](https://help.qlik.com/en-US/sense-developer/3.2/Subsystems/APIs/Content/MashupAPI/qlik-app-interface.htm)
* you do NOT want to load qlik's require.js directly as it in-turn loads Qlik's version of libraries (jquery, angular, require) which may **conflict** with your website's
* you want to load qlik.js **on-demand** and avoid conflicts like `WARNING: Tried to load angular more than once`, jQuery version conficts etc. 
* you want to **dynamically embed** qlik sense objects (charts, sheets, selection bar) without worrying about CORS and virtual proxy settings

 
### Usage
Include the qlik-isolated.js file
```HTML
<script src="qlik-isolated.js"></script>
```

###### Get Qlik object
```javascript
qlikIsolated
    .getQlik('http://<qlikserver>:<port>')
    .then(function(qlik){
        // qlik object can be access here
    })
```

###### Embed a qlik object (chart, sheet etc)
```javascript
qlikIsolated
    .getObjectIsolated(	$('#myDiv'),  \\ element
    			'My App.qvf', \\ app id
    			'prgzES',     \\ object id
    			'eRxSeT',     \\ sheet id (optional, if object id is specified)
    			'http://<qlikserver>:<port>'); \\ Qlik Server URL 
    
```

###### Embed selection bar
if you have a number of qlik objects and would like a common selection bar say, at the top

```javascript
qlikIsolated
    .getSelectionBarIsolated($('#header'),  \\ element
    			'My App.qvf',       \\ app id
    			'http://<qlikserver>:<port>'); \\ Qlik Server URL 
    
```

###### Autoload Qlik upon page load
To automatically load qlik.js and make it globally available through the window object, add a `qlikIsolatedLoadConfig ` object before the qlik-isolated.js script reference

```HTML
<script>
    var qlikIsolatedLoadConfig = {
        url : 'http://<qlikserver>:<port>',
        makeGlobal : true
    }
</script>
<script src="qlik-isolated.min.js"></script>
```
<br>

### Under the hood
---
###### Loading qlik.js
An iframe is created through which Qlik's require.js is loaded. When require loads qlik, the qlik object is passed to the parent frame

###### Embedding qlik objects
Single integration API iframes are created dynamically and added to the DOM

### P.S
---
`#experimental`<br>
works fine for most basic App API related stuffs. Haven't tested every single App API endpoint though

### License
---
MIT