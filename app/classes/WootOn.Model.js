WootOn.Model = Class.create({
	callback: false,
	feedURL: false,
	
	rawData: false,
	
	condition: false,
	description: false,
	detailimage: false,
	price: false,
	purchaseurl: false,
	soldout: false,
	soldoutpercentage: false,
	standardimage: false,
	subtitle: false,
	thumbnailimage: false,
	timeStamp: false,
	title: false,
	wootoff: false,
	
	isLoaded: false,
	
	
	initialize: function()
	{
		this.onSuccess = this.onSuccess.bind(this);
		this.onFailure = this.onFailure.bind(this);
	},
	
	loadViaJSON: function(json)
	{
		if (!json) return false;
		this.rawData = json;
		// awesomely dangerous. plz don'tz hax muh feed
		for(var prop in this.rawData) if (this.rawData.hasOwnProperty(prop))
		{
			this[prop] = this.rawData[prop];
		}
		this.soldout = (this.soldout == "false" || !this.soldout ? false : true);
		this.wootoff = (this.wootoff == "false" || !this.wootoff ? false : true);
		this.description = this.description.replace('img { display:none; }' , '.bigDescription .description img { display:none; }'); // iphone specific stuff
		this.description = this.description.replace('h2 { display:none; } h3 { font-size:16px; font-weight:bold; }' , ''); // iphone specific stuff
		this.isLoaded = true;
	},
	
	loadViaURL: function(url , cb)
	{
		if (!url) return;
		this.feedURL = url
		this.callback = cb || function() {};
		this.ajaxRequest = new Ajax.Request(this.feedURL , {onSuccess: this.onSuccess , onFailure: this.onFailure});
	},
	
	update: function(cb)
	{
		var cb = cb || function() {};
		this.loadViaURL(this.feedURL , cb);
	},
	
	onSuccess: function(t)
	{
		if (t.status != 200)
		{
			return this.onFailure();
		}
		
		try
		{
			var json = t.responseText.evalJSON();
			this.loadViaJSON(json);
		}
		catch(e)
		{
			return this.onFailure();
		}
		return this.callback(true);
	},
	
	onFailure: function(t)
	{
		return this.callback(false);
	},
	
	isWootOff: function()
	{
		if (!this.rawData) return false;
		return this.wootoff;
	},
	
	isSoldout: function()
	{
		if (!this.rawData) return false;
		return this.soldout;
	}
});