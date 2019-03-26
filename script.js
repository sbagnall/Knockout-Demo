$(function () {

	// ko.validation.rules.pattern.message = 'Invalid.';

	ko.validation.init({
	    registerExtenders: true,
	    messagesOnModified: true,
	    insertMessages: true,
	    parseInputAttributes: true,
	    messageTemplate: null
	}, true);

	var newItem = {
			itemNo: 1,
			description: '',
			qty: 0,
			pricePer: 0,
			total: 0
		};

	var data = [ makeObservable(newItem) ];

	function makeObservable(item) {

		var observableItem = {
			itemNo: ko.observable(item.itemNo),
			description: ko.observable(item.description),
			qty: ko.observable(item.qty).extend({min: 0}),
			pricePer: ko.observable(item.pricePer).extend({min: 0}),
		};

		observableItem.total = ko.computed(function () {
				return this.qty() * this.pricePer();
			}, observableItem);

		return observableItem;
	}

	var viewModel = {

		orderReference: ko.observable('').extend({ required: { message: "Order Reference is required" }}),
		date: (new Date()).toLocaleDateString('en-GB'),
		items: ko.observableArray(data),

		addItem: function () {
			if (viewModel.errors().length === 0) {
            	var itemToAdd = newItem;
				var length = this.items().length;

				if (length === 0) {
					itemToAdd.itemNo = 1;				
				} else {
					itemToAdd.itemNo = this.items()[length - 1].itemNo() + 1; 	
				}
				
				this.items.push(makeObservable(itemToAdd));
        	}
        	else {
        	    viewModel.errors.showAllMessages();
    	    }
		},
	};

	viewModel.grandTotal = ko.computed(function() {
    	var total = 0;
    	ko.utils.arrayForEach(this.items(), function (item) {
    		total += item.total();
    	});
    	return total;
	}, viewModel),

	$(document).on('click', '.item-remove', function () {
		viewModel.items.remove(ko.dataFor(this));
	})

	viewModel.errors = ko.validation.group(viewModel);

	ko.applyBindings(viewModel);

});