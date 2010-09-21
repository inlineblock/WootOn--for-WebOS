NotificationsAssistant = Class.create({
	wootEl: [],
	initialize: function(o)
	{
		o = o || {};
		this.completed = o.models;
		this.wootEl = [];
		this._wootClick = this.wootClick.bindAsEventListener(this);
		this._nextButtonClick = this.nextButtonClick.bindAsEventListener(this);
		window.setTimeout(WootOn.Notifications.enable , 500);
	},
	
	setup: function()
	{
		if (!this.completed || this.completed.length < 1)
		{
			return this.close();
		}
		this.notificationModule = this.controller.get('notificationModule');
		this.notificationContainer = this.controller.get('notificationContainer');
		this.initDOM();
		
		var notify = WootOn.Preferences.getNotificationSettings();
		if (notify.vibrate)
		{
			this.doVibrate(3);
		}
	},
	
	initDOM: function()
	{
		if (this.completed.length === 1)
		{
			this.notificationContainer.innerHTML = Mojo.View.render({object: this.completed[0] , template: "Notifications/woot"});
			this.notificationContainer.woot = this.completed[0];
			this.notificationContainer.addClassName('wootType');
			this.notificationContainer.observe(Mojo.Event.tap , this._wootClick);
		}
		else
		{
			for(var i=0; i< this.completed.length; i++)
			{
				var woot = this.completed[i];
				var el = new Element('div' , {id:woot.type , className:'wootType'});
				el.woot = woot;
				el.innerHTML = Mojo.View.render({object: woot , template: "Notifications/woot"});
				this.wootEl.push(el);
				this.notificationContainer.appendChild(el);
				if (i == 0)
				{
					el.show();
				}
				else
				{
					el.hide();
				}
				el.observe(Mojo.Event.tap , this._wootClick);
			}
			this.currentEl = 0;
			this.addNextButton();
		}
	},
	
	cleanup: function()
	{
		if (this.wootEl && this.wootEl.length)
		{
			for(var i=0; i < this.wootEl.length; i++)
			{
				this.wootEl[i].stopObserving(Mojo.Event.tap , this._wootClick);
			}
		}
	},
	
	wootClick: function(event)
	{
		var el = event.srcElement || event.target;
		
		if (!el.hasClassName('wootType'))
		{
			el = el.up('.wootType');
		}
		woot = el.woot || false;
		if (!woot) return;
		WootOn.StageManager.close('woot');
		WootOn.StageManager.newCard('woot' , woot.type , {switchTo: woot.type , initial: true});
		if (this.completed.length === 1)
		{
			this.close();
		}
	},
	
	close: function()
	{
		window.setTimeout(function(){WootOn.StageManager.close('Notifications');} , 400);
	},
	
	
	addNextButton: function()
	{
		this.nextButton = new Element('div' , {id:'nextButton'});
		this.notificationContainer.appendChild(this.nextButton);
		this.nextButton.observe(Mojo.Event.tap , this._nextButtonClick);
	},
	
	nextButtonClick:function()
	{
		this.wootEl[this.currentEl].hide();
		
		if (this.currentEl + 1 >= this.wootEl.length)
		{
			this.currentEl = 0;
		}
		else
		{
			this.currentEl = this.currentEl + 1;
		}
		
		this.wootEl[this.currentEl].show();
	},
	
	doVibrate: function(times)
	{
		if (!times) return false;
		Mojo.Controller.getAppController().playSoundNotification('vibrate' , '');
		window.setTimeout(this.doVibrate.bind(this , --times) , 500)
	}
});