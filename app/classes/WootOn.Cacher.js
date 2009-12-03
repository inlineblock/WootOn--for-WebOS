WootOn.Cacher = Class.create({
	data: false,
	depot: false,
	allKey: 'basicallyEverything',
	
	initialize: function()
	{
		this.models = false;
		this.depot = false;
		this.loadAllComplete = false;
		this.initializeDepot();
	},
	
	
	initializeDepot: function()
	{
		this.depot = new Mojo.Depot({name: 'ext:WootOnDB' , estimatedSize:999999} , this.initializeDepotSuccess.bind(this) , this.initializeDepotFailure.bind(this));
	},
	
	initializeDepotSuccess: function()
	{
		this.depotReady = true;
		this.depotError = false;
		window.setTimeout(this.loadAllIntoCacher.bind(this , this.loadAllCompleteCallBack.bind(this)) , 5);
	},
	
	initializeDepotFailure: function(e)
	{
		Mojo.Log.info('-----Cacher::initializeDepotfailure' , Object.toJSON(e));
		this.depotReady = false;
		this.depotError = true;
		this.loadAllComplete = true;
		this.models = {};
	},
	
	loadAllIntoCacher: function(callBack , count)
	{
		callBack = callBack || Mojo.doNothing;
		count = count || 1;
		if (this.depotError || count > 5) return callBack(false);
		if (!this.depotReady) window.setTimeout(this.loadAll.bind(this , callBack , count+1) , 500);
		
		this.depot.get(this.allKey , this.loadAllSuccess.bind(this , callBack) , this.loadAllFailure.bind(this , callBack));
	},
	
	loadAllSuccess: function(callBack , storables)
	{
		callBack = callBack || Mojo.doNothing;
		this.models = {};
		
		if (storables)
		{
			for(var i in storables) if (storables.hasOwnProperty(i))
			{
			
				this.models[i] = new WootOn.Model(WootOn.getFeedURL(i));
				this.models[i].restore(storables[i]);
			}
		}
		callBack();
	},
	
	loadAllFailure: function(callBack)
	{
		callBack = callBack || Mojo.doNothing;
		this.models = {};
		callBack();
	},
	
	loadAllCompleteCallBack: function()
	{
		Mojo.Log.info('-----Cacher::loadAllComplete');
		this.loadAllComplete = true;
	},
	
	saveToDepot: function(callBack)
	{
		callBack = callBack || Mojo.doNothing;
		this.timedSaver = false;
		
		var storable = {};
		for(var i in this.models) if (this.models.hasOwnProperty(i))
		{
			storable[i] = this.models[i].getStorable();
		}
		
		this.depot.add(this.allKey , storable , this.saveToDepotSuccess.bind(this , callBack) , this.saveToDepotFailure.bind(this , callBack));
	},
	
	saveToDepotSuccess: function(callBack)
	{
		callBack = callBack || Mojo.doNothing;
		callBack(true);
	},
	
	saveToDepotFailure: function(callBack , e)
	{
		callBack = callBack || Mojo.doNothing;
		callBack(false);
	},
	
	set: function(type  , value)
	{
		this.models[type] = value;
		
		
		if (this.timedSaver)
		{
			window.clearTimeout(this.timedSaver);
		}
		this.timedSaver = window.setTimeout(this.saveToDepot.bind(this) , 200);
	},
	
	get: function(type , callBack , tries)
	{
		callBack = callBack || Mojo.doNothing;
		tries  = tries || 1;
		if (!this.loadAllComplete)
		{
			if (tries > 5)
			{
				return window.setTimeout(function() { callBack(false) } , 10);
			}
			else
			{
				return window.setTimeout(this.get.bind(this , type , callBack , tries+1) , 750);
			}
		}
		
		var model = this.models[type] || false;
		window.setTimeout(function() { callBack(model) } , 10);
	},
	
	getAll: function(callBack , tries)
	{
		callBack = callBack || Mojo.doNothing;
		tries  = tries || 1;
		if (!this.loadAllComplete)
		{
			if (tries > 5)
			{
				return window.setTimeout(function() { callBack(false) } , 10);
			}
			else
			{
				return window.setTimeout(this.getAll.bind(this , callBack , tries+1) , 750);
			}
		}
		callBack(this.models);
	}

});