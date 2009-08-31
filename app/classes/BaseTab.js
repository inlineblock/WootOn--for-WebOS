BaseTab = Class.create({
	navOffset: false,
	
	initialize: function(o)
	{
		var o = o || {};
		this.navOffset = o.navOffset || "0px";
		this.initListeners();
		this.doInitialize();
	},
	
	initListeners: function()
	{
		this._scrollToTop = this.scrollToTop.bindAsEventListener(this);
	},
	
	setup: function()
	{
		this.initNav();
		this.doSetup();
	},
	
	cleanup: function()
	{
		this.doCleanup();
	},
	
	activate: function(e)
	{
		this.nav.activate();
		this.doActivate();
		
		var main = this.controller.getSceneScroller().down("div#main");
		if (main)
		{
			main.observe(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	deactivate: function(e)
	{
		this.nav.deactivate();
		this.doDeactivate();
		
		var main = this.controller.getSceneScroller().down("div#main");
		if (main)
		{
			main.stopObserving(Mojo.Event.tap , this._scrollToTop);
		}
	},
	
	initNav: function()
	{
		this.nav = new WootOn.Nav(this.controller.sceneName);
		this.nav.addCallBack(this.navClick.bind(this));
		this.controller.getSceneScroller().appendChild(this.nav.DOM);
		this.nav.setSizing();
		if (this.navOffset)
		{
			this.nav.setOffset(this.navOffset);
		}
	},
	
	navClick: function(e)
	{
		var el = e.srcElement || e.target;
		if (el.assistant == this.controller.sceneName) return false;
		this.nav.addHighlight(el.assistant);
		if (this.doNavSwitch)
		{
			window.clearTimeout(this.doNavSwitch);
		}
		this.doNavSwitch = window.setTimeout(this.navSwitch.bind(this , el.assistant) , 420);
	},
	
	navSwitch: function(scene , o)
	{
		var options = {user:this.user , navOffset: this.nav.getOffset()};
		var o = o || {};
		var options = Object.extend(options , o);
		this.controller.stageController.swapScene({name: scene , transition: Mojo.Transition.crossFade} , options);
	},
	
	errorDialog: function(msg , cb)
	{
		if (!msg) return false;
		var cb = cb || function(){};
		this.dialog('Error' , msg , cb);
	},
	
	dialog: function(title , msg , cb)
	{
		if (!title || !msg) return false;
		var cb = cb || function(){};
		
		this.controller.showAlertDialog({
		    onChoose: cb ,
		    title: $L(title),
		    message: $L(msg),
		    choices:[
		         {label:$L('continue')} 
		    ]
		   });
	},
	
	scrollToTop: function()
	{
		var scroller = this.controller.getSceneScroller();
		var distance;
		//scroller.scrollTop = (0);
		var func = (function(el , distance) { 
			var cur = el.scrollTop;
			cur -= distance;
			if (cur < 5)
			{
				el.scrollTop = 0;
				return;
			}
			else
			{
				el.scrollTop = cur;
				window.setTimeout(arguments.callee.bind({}, el , distance) , 50);
			}
		});
		
		distance = Math.ceil(scroller.scrollTop/10);
		if (distance < 30) distance = 30;
		func(scroller , distance);
	},
	
	doInitialize: function(){},
	doSetup: function(){},
	doCleanup: function(){},
	doActivate: function(){},
	doDeactivate: function(){},
});