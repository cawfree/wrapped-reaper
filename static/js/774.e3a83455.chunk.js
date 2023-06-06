"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[774],{3774:function(e,t,r){r.r(t),r.d(t,{AlchemyProvider:function(){return p}});var n=r(1752),i=r(1120),o=r(136),s=r(9388),c=r(4165),a=r(5671),u=r(3144),h=r(3037),d=r(8133),f=r(7652),l=r(8786),v=(r(1881),function(){function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100;(0,a.Z)(this,e),this.sendBatchFn=t,this.maxBatchSize=r,this.pendingBatch=[]}return(0,u.Z)(e,[{key:"enqueueRequest",value:function(e){return(0,h._)(this,void 0,void 0,(0,c.Z)().mark((function t(){var r,n,i=this;return(0,c.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={request:e,resolve:void 0,reject:void 0},n=new Promise((function(e,t){r.resolve=e,r.reject=t})),this.pendingBatch.push(r),this.pendingBatch.length===this.maxBatchSize?this.sendBatchRequest():this.pendingBatchTimer||(this.pendingBatchTimer=setTimeout((function(){return i.sendBatchRequest()}),10)),t.abrupt("return",n);case 5:case"end":return t.stop()}}),t,this)})))}},{key:"sendBatchRequest",value:function(){return(0,h._)(this,void 0,void 0,(0,c.Z)().mark((function e(){var t,r;return(0,c.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.pendingBatch,this.pendingBatch=[],this.pendingBatchTimer&&(clearTimeout(this.pendingBatchTimer),this.pendingBatchTimer=void 0),r=t.map((function(e){return e.request})),e.abrupt("return",this.sendBatchFn(r).then((function(e){t.forEach((function(t,r){var n=e[r];if(n.error){var i=new Error(n.error.message);i.code=n.error.code,i.data=n.error.data,t.reject(i)}else t.resolve(n.result)}))}),(function(e){t.forEach((function(t){t.reject(e)}))})));case 5:case"end":return e.stop()}}),e,this)})))}}]),e}()),p=function(e){(0,o.Z)(r,e);var t=(0,s.Z)(r);function r(e){var n;(0,a.Z)(this,r);var i=r.getApiKey(e.apiKey),o=r.getAlchemyNetwork(e.network),s=r.getAlchemyConnectionInfo(o,i,"http");void 0!==e.url&&(s.url=e.url),s.throttleLimit=e.maxRetries;var c=h.E[o];(n=t.call(this,s,c)).apiKey=e.apiKey,n.maxRetries=e.maxRetries,n.batchRequests=e.batchRequests;var u=Object.assign(Object.assign({},n.connection),{headers:Object.assign(Object.assign({},n.connection.headers),{"Alchemy-Ethers-Sdk-Method":"batchSend"})});return n.batcher=new v((function(e){return(0,l.rd)(u,JSON.stringify(e))})),n}return(0,u.Z)(r,[{key:"detectNetwork",value:function(){var e=this,t=Object.create(null,{detectNetwork:{get:function(){return(0,n.Z)((0,i.Z)(r.prototype),"detectNetwork",e)}}});return(0,h._)(this,void 0,void 0,(0,c.Z)().mark((function e(){var r;return(0,c.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=(r=this.network)){e.next=7;break}return e.next=4,t.detectNetwork.call(this);case 4:if(r=e.sent){e.next=7;break}throw new Error("No network detected");case 7:return e.abrupt("return",r);case 8:case"end":return e.stop()}}),e,this)})))}},{key:"_startPending",value:function(){(0,h.l)("WARNING: Alchemy Provider does not support pending filters")}},{key:"isCommunityResource",value:function(){return this.apiKey===h.D}},{key:"send",value:function(e,t){return this._send(e,t,"send")}},{key:"_send",value:function(e,t,r){var n=this,i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],o={method:e,params:t,id:this._nextId++,jsonrpc:"2.0"};if(Object.assign({},this.connection).headers["Alchemy-Ethers-Sdk-Method"]=r,this.batchRequests||i)return this.batcher.enqueueRequest(o);this.emit("debug",{action:"request",request:(0,h.d)(o),provider:this});var s=["eth_chainId","eth_blockNumber"].indexOf(e)>=0;if(s&&this._cache[e])return this._cache[e];var c=(0,l.rd)(this.connection,JSON.stringify(o),m).then((function(e){return n.emit("debug",{action:"response",request:o,response:e,provider:n}),e}),(function(e){throw n.emit("debug",{action:"response",error:e,request:o,provider:n}),e}));return s&&(this._cache[e]=c,setTimeout((function(){n._cache[e]=null}),0)),c}}],[{key:"getApiKey",value:function(e){if(null==e)return h.D;if(e&&"string"!==typeof e)throw new Error("Invalid apiKey '".concat(e,"' provided. apiKey must be a string."));return e}},{key:"getNetwork",value:function(e){return"string"===typeof e&&e in h.C?h.C[e]:(0,d.H)(e)}},{key:"getAlchemyNetwork",value:function(e){if(void 0===e)return h.a;if("number"===typeof e)throw new Error("Invalid network '".concat(e,"' provided. Network must be a string."));if(!Object.values(h.N).includes(e))throw new Error("Invalid network '".concat(e,"' provided. Network must be one of: ")+"".concat(Object.values(h.N).join(", "),"."));return e}},{key:"getAlchemyConnectionInfo",value:function(e,t,r){var n="http"===r?(0,h.g)(e,t):(0,h.b)(e,t);return{headers:h.I?{"Alchemy-Ethers-Sdk-Version":h.V}:{"Alchemy-Ethers-Sdk-Version":h.V,"Accept-Encoding":"gzip"},allowGzip:!0,url:n}}}]),r}(f.r);function m(e){if(e.error){var t=new Error(e.error.message);throw t.code=e.error.code,t.data=e.error.data,t}return e.result}}}]);