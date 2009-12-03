WootOn.Nav = Class.create({

	controller:false,
	DOM: false,
	Dragger: false,
	activeTab: false,
	flick: false,
	flicker: false,
	
	navData: [
				{className:'woot' , title:"Woot!"} , 
				{className:'shirt' , title:"Shirt!"} , 
				{className:"sellout" , title:"Sellout!"} ,
				{className:"kids" , title:"Kids!"} ,
				{className:"wine" , title:"Wine!"}
			],
	
	navItems: [],
	
	initialize: function(activeTab)
	{
		this.activeTab = activeTab || "woot";
		this.initDOM();
		this._internalCallBack = this.internalCallBack.bindAsEventListener(this);
		this._onDragStart = this.onDragStart.bindAsEventListener(this);
		this._onDragEnd = this.onDragEnd.bindAsEventListener(this);
		this._onDragging = this.onDragging.bindAsEventListener(this);
		this._flickHandler = this.flickHandler.bindAsEventListener(this);
		this._mouseDown = this.mouseDown.bindAsEventListener(this);
		
		this.initHighlight(this.activeTab);
	},
	
	initDOM: function()
	{
		this.DOM = new Element('div' , {id: 'bottomNavWrapper' , className:'bottomNavWrapper'});
		this.Dragger = new Element('div' , {className:'bottomNav'});
		this.DOM.appendChild(this.Dragger);
		this.highlighter = new Element('div' , {id: 'highlighter'});
		this.Dragger.appendChild(this.highlighter);
		this.leftArrow = new Element('div' , {className:'leftArrow'});
		this.rightArrow = new Element('div' , {className:'rightArrow'});
		this.Dragger.appendChild(this.leftArrow);
		this.Dragger.appendChild(this.rightArrow);
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
			this.Dragger.appendChild(this.navItems[i]);
		}
	},
	
	setSizing: function()
	{
		this.maxOffset = (this.Dragger.scrollWidth - this.DOM.offsetWidth) * -1;
		this.setArrows();
	},
	
	initHighlight: function(navItem)
	{
		if (!this.activeTab || this.activeTab != navItem)
		{
			this.addHighlight(navItem);
		}
	},
	
	addHighlight: function(navItem)
	{
		if (!navItem || !this.DOM.parentNode) return;
		var item;
		var i = 0;
		this.DOM.className = navItem;
		while (item = this.Dragger.down('.navItem' , i))
		{
			if (item.hasClassName(navItem))
			{
				item.addClassName('highlight');
				var offset = item.offsetLeft;
				this.highlighter.setStyle({left: offset + 'px'});
				this.activeTab = navItem;
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
		this.Dragger.observe(Mojo.Event.dragEnd , this._onDragEnd);
		this.Dragger.observe(Mojo.Event.dragging , this._onDragging);
		
		this.firstPointer = e.move.clientX;
		this.originalOffset = this.getOffsetNum();
		if (this.flickAnimator)
		{
			this.flickAnimator.cancel();
			delete this.flickAnimator;
		}
	},
	
	onDragEnd: function(e)
	{
		this.firstPointer = false;
		this.originalOffset = false;
		this.dragStartTime = false;
		this.Dragger.stopObserving(Mojo.Event.dragEnd , this._onDragEnd);
		this.Dragger.stopObserving(Mojo.Event.dragging , this._onDragging);
	},
	
	onDragging: function(e)
	{
		if (this.maxOffset >= 0) return;
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
		this.Dragger.setStyle({left: p + "px"});
		this.setArrows();
	},
	
	flickHandler: function(e)
	{
		if (this.maxOffset >= 0) return;
		if (this.flickAnimator)
		{
			this.flickAnimator.cancel();
			delete this.flickAnimator;
		}
		
		this.flickAnimator = Mojo.Animation.animateValue(this.getAnimationQueue(), 'linear', this.animateCallBack.bind(this), {onComplete: this.animatorComplete.bind(this) , from: this.getOffsetNum(), to: (this.getOffsetNum() + (e.velocity.x * 0.3)), duration: 0.5 , curve: Mojo.Animation.easeOut });
	},
	
	animatorComplete: function()
	{
		delete this.flickAnimator;
		this.setArrows();
	},
	
	animateCallBack: function(val)
	{
		val = val || 0;
		if (val >= 0)
		{
			this.Dragger.setStyle({left: 0 + "px"});
			this.frameDistanceAnimator.cancel();
			delete this.flickAnimator;
			this.setArrows();
			return;
		}
		else if (val < this.maxOffset)
		{
			this.Dragger.setStyle({left: this.maxOffset + "px"});
			this.frameDistanceAnimator.cancel();
			delete this.flickAnimator;
			this.setArrows();
			return;
		}
		else
		{
			this.Dragger.setStyle({left: val + "px"});
			this.setArrows();
		}
	},
	
	getAnimationQueue: function() 
	{
		return Mojo.Animation.queueForElement(this.Dragger);
	},
	
	activate: function()
	{
		this.addHighlight(this.activeTab);
		this._internalCallBack = this.internalCallBack.bindAsEventListener(this);
		for(var i=0;i < this.navItems.length; i++)
		{
			this.navItems[i].observe(Mojo.Event.tap , this._internalCallBack);
		}
		
		this.Dragger.observe(Mojo.Event.dragStart , this._onDragStart);
		this.Dragger.observe(Mojo.Event.flick , this._flickHandler);
		this.Dragger.observe("mousedown" , this._mouseDown);
	},
	
	deactivate: function()
	{
		for(var i=0;i < this.navItems.length; i++)
		{
			this.navItems[i].stopObserving(Mojo.Event.tap , this._internalCallBack);
		}
		
		this.Dragger.stopObserving(Mojo.Event.dragStart , this._onDragStart);
	},
	
	getOffset: function()
	{
		return (this.Dragger.style.left ? this.Dragger.style.left : "0px");
	},
	
	getOffsetNum: function()
	{
		var offset = this.getOffset();
		return ~~(offset.substr(0 , offset.length-2));
	},
	
	setOffset: function(offset)
	{
		this.Dragger.setStyle({left: offset});
		this.setArrows();
	},
	
	setArrows: function()
	{
		var offset = this.getOffsetNum();
		
		if (offset > this.maxOffset + 18)
		{
			this.rightArrow.show();
		}
		else
		{
			this.rightArrow.hide();
		}
		
		if (offset > -18)
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
	},
	
	resetSizing: function()
	{
		this.setSizing();
		try
		{
			var p = this.getOffsetNum();
			if (p > 0)
			{
				p = 0;
			}
			else if (p < this.maxOffset)
			{
				p = this.maxOffset;
			}
			
			if (this.maxOffset >= 0)
			{
				p = 0;
			}
			this.setOffset(p + 'px');
		}
		catch(e)
		{
			this.setOffset(0 + 'px');
		}
	}
	
});