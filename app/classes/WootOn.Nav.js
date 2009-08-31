WootOn.Nav = Class.create({

	controller:false,
	DOM: false,
	activeTab: false,
	flick: false,
	flicker: false,
	
	navData: [
				{className:'woot' , title:"Woot!"} , 
				{className:'shirt' , title:"Shirt!"} , 
				{className:"sellout" , title:"Sellout!"} ,
				{className:"kids" , title:"Kids!"} ,
				{className:"wine" , title:"Wine!"} ,
				
				
			],
	
	navItems: [],
	
	initialize: function(activeTab)
	{
		this.activeTab = activeTab || "timeline";
		this.initDOM();
		this._internalCallBack = this.internalCallBack.bindAsEventListener(this);
		this._onDragStart = this.onDragStart.bindAsEventListener(this);
		this._onDragEnd = this.onDragEnd.bindAsEventListener(this);
		this._onDragging = this.onDragging.bindAsEventListener(this);
		this._flickHandler = this.flickHandler.bindAsEventListener(this);
		this._flickUpdater = this.flickUpdater.bind(this);
		this._mouseDown = this.mouseDown.bindAsEventListener(this);
	},
	
	initDOM: function()
	{
		this.DOM = new Element('div' , {className:'bottomNav'});
		this.DOM.setAttribute('x-mojo-element' , "Scroller");
		this.highlighter = new Element('div' , {id: 'highlighter'});
		this.DOM.appendChild(this.highlighter);
		this.leftArrow = new Element('div' , {className:'leftArrow'});
		this.rightArrow = new Element('div' , {className:'rightArrow'});
		this.DOM.appendChild(this.leftArrow);
		this.DOM.appendChild(this.rightArrow);
		this.navItems = [];
		for(var i=0; i < this.navData.length; i++)
		{
			var nav = this.navData[i];
			var item = new Element('div' , {className:nav.className , id:nav.className});
			item.assistant = nav.className;
			item.addClassName('navItem');
			if (i == 0)
			{
				item.addClassName('first');
			}
			if (i == this.navData.length-1)
			{
				item.addClassName('last');
			}
			item.innerHTML = nav.title;
			this.navItems.push(item);
			this.DOM.appendChild(this.navItems[i]);
		}
		this.addHighlight(this.activeTab);
	},
	
	setSizing: function()
	{
		var size = 0;
		var children = this.DOM.childElements();
		for (var i=0; i < children.length; i++)
		{
			if (children[i].hasClassName('navItem'))
			{
				var width = children[i].getWidth();
				size += width +8;
			}
		}
		size += 20;
		this.DOM.setStyle({width: size + "px"});
		if (this.DOM.parentNode)
		{
			var width = this.DOM.parentNode.offsetWidth;	
		}
		else
		{
			var width = window.innerWidth || 320;
		}
		this.maxOffset = (size-(width)) * -1;
		this.setArrows();
	},
	
	addHighlight: function(navItem)
	{
		if (!navItem) return;
		var item;
		var i = 0;
		this.DOM.className = navItem + " bottomNav";
		this.highlighter.className = navItem;
		while (item = this.DOM.down('.navItem' , i))
		{
			if (item.hasClassName(navItem))
			{
				item.addClassName('highlight');
			}
			else
			{
				item.removeClassName('highlight');
			}
			i++;
		}
	},
	
	addCallBack: function(cB)
	{
		this.callBack = cB || function(){};
	},
	
	internalCallBack: function(e)
	{
		var date = new Date();
		if (this.dragStartTime && this.dragStartTime < (date.getTime() - 450))
		{
			this.dragStartTime = false;
		}
		else
		{
			window.setTimeout(this.doCallback.bind(this , e) , 25);
		}
	},
	
	doCallback: function(e)
	{
		if (!this.flick)
		{
			this.callBack(e);
		}
	},
	
	mouseDown: function(e)
	{
		var date = new Date();
		this.dragStartTime = date.getTime();
		this.flick = false;
		if (this.flicker)
		{	
			window.clearTimeout(this.flicker);
		}
	},
	
	onDragStart: function(e)
	{
		this.DOM.observe(Mojo.Event.dragEnd , this._onDragEnd);
		this.DOM.observe(Mojo.Event.dragging , this._onDragging);
		
		this.firstPointer = e.move.clientX;
		this.originalOffset = this.getOffsetNum();
		this.flick = false;
		if (this.flicker)
		{	
			window.clearTimeout(this.flicker);
		}
	},
	
	onDragEnd: function(e)
	{
		this.firstPointer = false;
		this.originalOffset = false;
		this.dragStartTime = false;
		this.DOM.stopObserving(Mojo.Event.dragEnd , this._onDragEnd);
		this.DOM.stopObserving(Mojo.Event.dragging , this._onDragging);
	},
	
	onDragging: function(e)
	{
		var p = (this.firstPointer - e.move.clientX)*-1;
		p = p + this.originalOffset;
		if (p > 0)
		{
			p = 0;
		}
		else if (p < this.maxOffset)
		{
			p = this.maxOffset;
		}
		this.DOM.setStyle({left: p + "px"});
		this.setArrows();
	},
	
	flickHandler: function(e)
	{
		this.flick = false;
		if (this.flicker)
		{
			window.clearTimeout(this.flicker);
		}
		this.flick = true;
		var times = Math.round(1250/50);
		var move = (e.velocity.x / times);
		this.flicker = window.setTimeout(this.flickUpdater.bind(this , move , times) , 25);
		var date = new Date();
		this.dragStartTime = date.getTime();
		this.flickOffset = this.getOffsetNum();
	},
	
	flickUpdater: function(velocity , move)
	{
		if (!this.flick) return;
		
		this.flickOffset = this.flickOffset + velocity;
		if (this.flickOffset > 0)
		{
			this.flickOffset = 0;
			this.DOM.setStyle({left: this.flickOffset + "px"});
			this.flickFinish();
			return;
		}
		else if (this.flickOffset < this.maxOffset)
		{
			this.flickOffset = this.maxOffset;
			this.DOM.setStyle({left: this.flickOffset + "px"});
			this.flickFinish();
			return;
		}
		
		if (move == 0 || (velocity < 1 && velocity > -1))
		{
			this.flickFinish();
			return;
		}
		this.DOM.setStyle({left: this.flickOffset + "px"});
		move--;
		velocity = Math.floor(velocity * 0.925);
		this.flicker = window.setTimeout(this.flickUpdater.bind(this , velocity , move) , 25);
		this.setArrows();
	},
	
	flickFinish: function()
	{
		this.flick = false;
		this.flicker = false;
		this.setArrows();
	},
	
	activate: function()
	{
		this.addHighlight(this.activeTab);
		this._internalCallBack = this.internalCallBack.bindAsEventListener(this);
		for(var i=0;i < this.navItems.length; i++)
		{
			this.navItems[i].observe(Mojo.Event.tap , this._internalCallBack);
		}
		
		this.DOM.observe(Mojo.Event.dragStart , this._onDragStart);
		this.DOM.observe(Mojo.Event.flick , this._flickHandler);
		this.DOM.observe("mousedown" , this._mouseDown);
	},
	
	deactivate: function()
	{
		for(var i=0;i < this.navItems.length; i++)
		{
			this.navItems[i].stopObserving(Mojo.Event.tap , this._internalCallBack);
		}
		
		this.DOM.stopObserving(Mojo.Event.dragStart , this._onDragStart);
	},
	
	getOffset: function()
	{
		return (this.DOM.style.left ? this.DOM.style.left : "0px");
	},
	
	getOffsetNum: function()
	{
		var offset = this.getOffset();
		return ~~(offset.substr(0 , offset.length-2));
	},
	
	setOffset: function(offset)
	{
		this.DOM.setStyle({left: offset});
		this.setArrows();
	},
	
	setArrows: function()
	{
		var offset = this.getOffsetNum();
		
		if (offset > this.maxOffset+12)
		{
			this.rightArrow.show();
		}
		else
		{
			this.rightArrow.hide();
		}
		
		if (offset > -25)
		{
			this.leftArrow.hide();
		}
		else
		{
			this.leftArrow.show();
		}
	},
	
	toString: function()
	{
		return "";
	}
	
});