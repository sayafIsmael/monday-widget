(this["webpackJsonpmonday-integration-quickstart-app"]=this["webpackJsonpmonday-integration-quickstart-app"]||[]).push([[0],{171:function(t,e,n){t.exports=n(270)},176:function(t,e,n){},177:function(t,e,n){},270:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),l=n(19),s=n.n(l),i=(n(176),n(81)),c=n(82),r=n(164),u=n(160),d=(n(177),n(140)),m=n.n(d),p=(n(192),n(193),n(316)),h=n(74),g=n.n(h),f=n(322),v=n(320),b=n(318),x=n(319),y=n(317),_=n(309),E=n(141),S=n.n(E),k=(p.a.Title,m()()),C=function(t){Object(r.a)(n,t);var e=Object(u.a)(n);function n(t){var a;return Object(i.a)(this,n),(a=e.call(this,t)).getMenuItem=function(){k.listen("settings",(function(t){a.setState({settings:t.data}),console.log("Settings Data: ",t)})),k.listen("context",(function(t){a.setState({context:t.data}),console.log("context",t.data),k.api("{\n          boards(ids: 1890240262) {\n            items {\n              name\n              column_values {\n                id\n                text\n              }\n            }\n          }\n        }",{variables:{boardIds:a.state.context.boardIds}}).then((function(t){var e=[],n=[];t.data.boards[0].items.map((function(t){return e.push(t.column_values)})),e.map((function(t,e){t.map((function(t){"people"==t.id&&""!=t.text&&"null"!=t.text&&void 0!=t.text&&(n.includes(t.text)||n.push(t.text))}))})),console.log("res.data",n),a.setState({people:n})}))}))},a.syncData=function(){a.setState({loading:!0}),k.listen("settings",(function(t){a.setState({settings:t.data})})),k.listen("context",(function(t){a.setState({context:t.data}),console.log(t.data),k.api("All"==a.state.filterBy?"{\n        boards(ids: 1890240262) {\n          items {\n            name\n            column_values {\n              id\n              text\n            }\n          }\n        }\n      }":'{\n        items_by_multiple_column_values(board_id: 1890240262, column_id: "people", column_values: ["'.concat(a.state.filterBy,'"]) {\n          name\n          column_values {\n            id\n            text\n          }\n        }\n      }'),{variables:{boardIds:a.state.context.boardIds}}).then((function(t){var e=[],n=[],o=[];t.data.boards?t.data.boards[0].items.map((function(t){return e.push(t.column_values)})):t.data.items_by_multiple_column_values.map((function(t){return e.push(t.column_values)})),e.map((function(t,a){t.map((function(t){"status9"==t.id&&"Appointment Shown"==t.text&&e[a].map((function(t){"date4"!=t.id||null==t.text&&""==t.text||g()().format("M")!=g()(t.text).format("M")||n.push(t.text)})),"date4"!=t.id||null==t.text&&""==t.text||g()().format("M")!=g()(t.text).format("M")||o.push(t.text)}))})),a.setState({totalLead:e.length,totalConverted:n.length,loading:!1}),console.log({totalLead:e.length,totalConverted:n.length})}))}))},a.handleChange=function(t){console.log(t.target.value),a.setState({filterBy:t.target.value}),a.syncData()},a.state={context:{},settings:{},name:"",boardData:{},totalConverted:0,totalLead:0,filterBy:"All",loading:!1,people:[]},a.getMenuItem(),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.syncData()}},{key:"render",value:function(){var t=this;return o.a.createElement("div",{className:"App",style:{background:this.state.settings.background}},o.a.createElement(_.a,{spacing:0,direction:"column",alignItems:"center",justifyContent:"center",style:{}},o.a.createElement(f.a,{sx:{minWidth:120,maxWidth:300}},o.a.createElement(x.a,{fullWidth:!0},o.a.createElement(v.a,{id:"demo-simple-select-label"},"People"),o.a.createElement(y.a,{labelId:"demo-simple-select-label",id:"demo-simple-select",value:this.state.filterBy,label:"people",onChange:function(e){return t.handleChange(e)},disabled:this.state.loading},o.a.createElement(b.a,{value:"All"},"All"),this.state.people.map((function(t,e){return o.a.createElement(b.a,{value:t,key:e},t)})))))),o.a.createElement("div",{style:{textAlign:"center",alignSelf:"center",justifyContent:"center"}},this.state.loading&&o.a.createElement("div",{style:{margin:"auto",maxWidth:71}},o.a.createElement(S.a,{type:"bubbles",color:"#0073ea"})),!this.state.loading&&o.a.createElement("h2",{style:{fontSize:75}},(parseFloat(this.state.totalConverted/this.state.totalLead*100)||0).toFixed(1),"%")))}}]),n}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[171,1,2]]]);
//# sourceMappingURL=main.0f81a8f9.chunk.js.map