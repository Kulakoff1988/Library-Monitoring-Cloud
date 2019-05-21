﻿
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------







/** @type ApiTS */

let api = {
    timeout: 0,
    ontimeout: function(method){},
    onerror: function(error, method, params, xhr){},
    debug: false,
    debugExcludes: {},
    //debugExcludesEmptyOnly: false,
    serviceName: window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')+'/api.svc',
    onUnauth: function(method){
        console.log('Unauthorized '+method);
        if (Lure && Lure.User)
            localStorage.setItem('LureRoute'+document.location.href.split('#')[0], document.location.hash);
        window.location.href = 'index.html'
    },
    onDeny: function(method, params){
        console.error('[Server] Method Access denied '+method, params);
        if (Lure)
            Lure.System.Error('[Access denied] Method: `' + method + '` is not allowed');
    },
    base64: (function(){function b(m,n,o,p,q,r){m+='';for(var y,t=0,u=0,v=m.length,w='',x=0;u<v;){for(y=m.charCodeAt(u),y=256>y?o[y]:-1,t=(t<<q)+y,x+=q;x>=r;){x-=r;var z=t>>x;w+=p.charAt(z),t^=z<<x}++u}return!n&&0<x&&(w+=p.charAt(t<<r-x)),w}for(var k,d='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',e='',f=[256],g=[256],h=0,j={encode:function encode(m){var n=m.replace(/[\u0080-\u07ff]/g,function(o){var p=o.charCodeAt(0);return String.fromCharCode(192|p>>6,128|63&p)}).replace(/[\u0800-\uffff]/g,function(o){var p=o.charCodeAt(0);return String.fromCharCode(224|p>>12,128|63&p>>6,128|63&p)});return n},decode:function decode(m){var n=m.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(o){var p=(15&o.charCodeAt(0))<<12|(63&o.charCodeAt(1))<<6|63&o.charCodeAt(2);return String.fromCharCode(p)}).replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(o){var p=(31&o.charCodeAt(0))<<6|63&o.charCodeAt(1);return String.fromCharCode(p)});return n}};256>h;)k=String.fromCharCode(h),e+=k,g[h]=h,f[h]=d.indexOf(k),++h;var l=function(m,n,o){return n?l[m](n,o):m?null:this};return l.btoa=l.encode=function(m,n){return m=!1===l.raw||l.utf8encode||n?j.encode(m):m,m=b(m,!1,g,d,8,6),m+'===='.slice(m.length%4||4)},l.atob=l.decode=function(m,n){m=(m+'').split('=');var o=m.length;do--o,m[o]=b(m[o],!0,f,e,6,8);while(0<o);return m=m.join(''),!1===l.raw||l.utf8decode||n?j.decode(m):m},l})(),
    make_base_auth: function (user, password) {
        var tok = user + ':' + password;
        var hash = this.base64.encode(tok);
        return 'Basic ' + hash;
    },
    dtToCs: function(date)
    {
        return Lure.Date(date).DateCs;
    },
    dtFromCs: function(datestr) {        
        return Lure.Date(datestr).Date;
    },
       /**
         *
         * @param {Promise<T>} promise
         * @param {ApiCallHandlers} [handlers]
         * @template T
         * @returns {Promise<T>}
         */
    call: function (promise, handlers) {
        if (!handlers)
            handlers = {};
        return promise.then(function(x){
            handlers.Then ? handlers.Then(x): null;
            handlers.Finally ?  handlers.Finally(x) : null;
			return promise;
        })
        .catch(function(x){
            handlers.Catch ? handlers.Catch(x): console.error('[api.call]', x);
            handlers.Finally ?  handlers.Finally(x) : null;
 			return promise;
        });
        //return promise;
    },
    remote_call_promise: function Req(method, params, isReturnStream){
        return new Promise(function (resolve, reject) {
            let isSendStream = false;
            let xhr = new XMLHttpRequest();
            xhr.responseType = isReturnStream ? 'blob':'';
            xhr.timeout = api.timeout;
            xhr.onload = function () {
                let result = xhr.response;
                if (xhr.status === 200 && xhr.responseType !== 'blob' && xhr.response)
                    result = JSON.parse(xhr.response);
                if (api.debug && ( Object.getOwnPropertyNames(api.debugExcludes).indexOf(method) < 0 || (api.debugExcludes[method] && !Lure.Object.isEmpty(result, true)) )){
                    let SpaceCount = 32-method.length;
                    console.log('%c[api]'+method+' '.repeat(SpaceCount>0? SpaceCount: 1)+'-> ', 'color: #11793E', params);
                }
                if ((api.debug || (typeof DEBUG !== 'undefined' && DEBUG) ) && ( Object.getOwnPropertyNames(api.debugExcludes).indexOf(method) < 0 || (api.debugExcludes[method] && !Lure.Object.isEmpty(result, true)) ))
                {
                    let SpaceCount = 32-method.length;
                    console.log('%c[api]'+method+' '.repeat(SpaceCount>0? SpaceCount: 1)+'<- ', 'color: #000',  result);
                }

                if (xhr.status === 200)
                {
                    resolve( result);
                }
                else if (xhr.status === 403){
                    reject('[api '+method+'] Error 403: Forbidden');
                    if (api.onerror)
                        api.onerror(null, method, params, xhr);
                    if (api.onDeny)
                        api.onDeny(method, params)
                }
                else if (xhr.status === 401)
                {
                    document.cookie = 'ssid=unauthorized;path=/';
                    reject('[api '+method+'] Error 401: Unauthorized');
                    if (api.onerror)
                        api.onerror(null, method, params, xhr);
                    if (api.onUnauth)
                        api.onUnauth(method);
                }
                else {
                    reject('[api '+ method+'] Error '+xhr.status+': '+this.statusText);
                    if (api.onerror)
                        api.onerror(null, method, params, xhr);
                }
            };
            xhr.onerror = function (e) {
                reject(e);
                if (api.onerror)
                    api.onerror(e, method, params, xhr);
            };
            xhr.addEventListener('timeout', function(e) {
                api.ontimeout(method, e);
                reject(method, e);
                if (api.onerror)
                    api.onerror(e, method, params, xhr);
            });
            xhr.open('POST', api.serviceName + '/' + method);

            //if input stream:
            if (params && params._StreamHeaders !== void 0 || params._File !== void 0){
                isSendStream = true;
                let Headers = params._StreamHeaders;
                let ContentDisposition = '';
                let keys = Object.getOwnPropertyNames(Headers);
                for (let i = 0; i < keys.length; i++){
                    let key = keys[i];
                    if (typeof Headers[key] === 'string')
                        Headers[key] = Headers[key].replace(/;/g, '');
                    ContentDisposition += `${key}= ${btoa(encodeURIComponent(Headers[key]))}`;
                    if (i < keys.length-1){
                        ContentDisposition += ';';
                    }
                }
                delete params._StreamHeaders;
                xhr.setRequestHeader('Content-Disposition', ContentDisposition);
                xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            }
            if (method === 'Login')
                xhr.setRequestHeader('Authorization', api.make_base_auth(params.Login, params.Pass));
            if (!isSendStream)
            {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                xhr.setRequestHeader('Accept','application/json');
                xhr.send(JSON.stringify(params));
            }
            else
                xhr.send(params._File);
        });
    },

    /**
      @param {string}Login
      @param {string}Pass
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<boolean>} 
    */            
    Login: function(Login, Pass, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('Login',  {Login:Login, Pass:Pass}, false), Handlers);     
    },
    /**
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<boolean>} 
    */            
    LogOff: function( Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('LogOff',  {}, false), Handlers);     
    },
    /**
      @param {string}NewPass
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<string>} 
    */            
    ChangePass: function(NewPass, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('ChangePass',  {NewPass:NewPass}, false), Handlers);     
    },
    /**
      @param {string}NewLogin
      @param {string}NewPass
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<string>} 
    */            
    NewLogin: function(NewLogin, NewPass, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('NewLogin',  {NewLogin:NewLogin, NewPass:NewPass}, false), Handlers);     
    },
    /**
      @param {string}Login
      @param {string}NewPass
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<string>} 
    */            
    ChangeLoginPass: function(Login, NewPass, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('ChangeLoginPass',  {Login:Login, NewPass:NewPass}, false), Handlers);     
    },
    /**
      @param {string}Login
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<LoginPermission[]>} 
    */            
    GetLoginPermissions: function(Login, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('GetLoginPermissions',  {Login:Login}, false), Handlers);     
    },
    /**
      @param {string}Login
      @param {LoginPermission}permission
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<string>} 
    */            
    DelLoginPermission: function(Login, permission, Handlers)         
    {                                            
        permission = Lure.Object.Clone(permission);
                                   
                      
        return api.call(api.remote_call_promise('DelLoginPermission',  {Login:Login, permission:permission}, false), Handlers);     
    },
    /**
      @param {string}Login
      @param {LoginPermission}permission
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<string>} 
    */            
    AddLoginPermission: function(Login, permission, Handlers)         
    {                                            
        permission = Lure.Object.Clone(permission);
                                   
                      
        return api.call(api.remote_call_promise('AddLoginPermission',  {Login:Login, permission:permission}, false), Handlers);     
    },
    /**
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<PermissionInfo[]>} 
    */            
    GetAllPermissionsTypes: function( Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('GetAllPermissionsTypes',  {}, false), Handlers);     
    },
    /**
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<Blob>} 
    */            
    Index: function( Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('Index',  {}, true), Handlers);     
    },
    /**
      @param {string}content
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<Blob>} 
    */            
    StaticContent: function(content, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('StaticContent',  {content:content}, true), Handlers);     
    },
    /**
      @param {string}content2
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<Blob>} 
    */            
    StaticContent2: function(content2, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('StaticContent2',  {content2:content2}, true), Handlers);     
    },
    /**
      @param {number}LastID
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<web_HistoryMasterGet_Result[]>} 
    */            
    Cache_GetMasterHistoryLast: function(LastID, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('Cache_GetMasterHistoryLast',  {LastID:LastID}, false), Handlers);     
    },
    /**
      @param {number}DeviceID
      @param {number}DeviceTypeID
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<Devices_TableDTO[]>} 
    */            
    Devices_Get: function(DeviceID, DeviceTypeID, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('Devices_Get',  {DeviceID:DeviceID, DeviceTypeID:DeviceTypeID}, false), Handlers);     
    },
    /**
      @param {number}DeviceID
      @param {number}DeviceTypeID
      @param {Date}DateStart
      @param {Date}DateFinish
      @param {ApiTSHandlersCallbacks} [Handlers]
      @return {Promise<Devices_Table_DataDTO[]>} 
    */            
    Devices_Data_Get: function(DeviceID, DeviceTypeID, DateStart, DateFinish, Handlers)         
    {                                            
                                   
                      
        return api.call(api.remote_call_promise('Devices_Data_Get',  {DeviceID:DeviceID, DeviceTypeID:DeviceTypeID, DateStart:Lure.Date(DateStart).DateCs, DateFinish:Lure.Date(DateFinish).DateCs}, false), Handlers);     
    },
}
