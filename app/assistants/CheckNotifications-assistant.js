CheckNotificationsAssistant = Class.create({
	initialize: function()
	{
		this.totalTries = 0;
		this.pending = [];
		this.completed = [];
		this.uncompleted = [];
	},
	
	setup: function()
	{
		this.text = this.controller.get('main-text');
		this.title = this.controller.get('main-title');
	},
	
	activate: function()
	{
		WootOn.Cache.getAll(this.getAllCallBack.bind(this));
	},
	
	deactivate: function()
	{
	
	},
	
	cleanup: function()
	{
		this.stop = true;
	},
	
	close: function()
	{
		window.setTimeout(function(){WootOn.StageManager.close('CheckNotifications');} , 400);
	},
	
	getAllCallBack: function(models)
	{
		if (!models)
		{
			this.close();
		}
		var notify = WootOn.Preferences.getNotificationSettings();
		for(var i in models) if (models.hasOwnProperty(i))
		{
			if (notify[i])
			{
				this.pending.push({type: i , model: models[i]});
			}
		}
		this.spawn();
	},
	
	spawn: function()
	{
		if (this.stop) return;
		if (this.pending.length < 1)
		{
			return this.completeRound();
		}
		
		var woot = this.pending[0];
		woot.model.checkForChange(this.checkForChangeCallBack.bind(this , woot));
		this.text.innerHTML = "Checking " + woot.type + "!";
	},
	
	checkForChangeCallBack: function(woot , change)
	{
		if (!change)
		{
			this.uncompleted.push(woot);
			this.removeAndSpawn(woot);
		}
		else
		{
			this.completed.push(woot);
			this.removeAndSpawn(woot);
		}
	},
	
	removeAndSpawn: function(woot)
	{
		this.pending = this.pending.without(woot);
		window.setTimeout(this.spawn.bind(this) , 300);
	},
	
	completeRound: function()
	{
		if (this.totalTries >= 6)
		{
			this.stop = true;
			this.text.innerHTML = "Checking Complete";
			return this.completeAll();
		}
		
		this.totalTries++;
		
		if (this.uncompleted.length > 0)
		{
			this.pending = this.uncompleted;
			this.uncompleted = [];
			this.text.innerHTML = "Sleeping for 30 seconds";
			return window.setTimeout(this.spawn.bind(this) , 30000);
		}
		
		// no uncomplete
		return this.completeAll();
	},
	
	completeAll: function()
	{
		if (this.completed.length > 0)
		{
			WootOn.StageManager.newDashboard('Notifications' , 'Notifications' , {models: this.completed});
		}
		
		this.close();
	}
});