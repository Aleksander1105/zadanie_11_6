$(function() {
	var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
	var myHeaders = {
  		'X-Client-Id': 3049,
  		'X-Auth-Token': 'ad79e81ba3e90534c834ba2eded85718'
	};

	$.ajaxSetup({
		headers: myHeaders
	});

	$.ajax({
    	url: baseUrl + '/board',
    	method: 'GET',
    	success: function(response) {
      		setupColumns(response.columns);
    	}
	});

	function setupColumns(columns) {
    	columns.forEach(function (column) {
    		var col = new Column(column.id, column.name);
        	board.createColumn(col);
        	setupCards(col, column.cards);
    	});
	}

	function setupCards(col, cards) {
		cards.forEach(function (card) {
			var cardObj = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
			col.createCard(cardObj);
		})
	}

	function Column(id, name) {
		var self = this;
		this.id = id;
    	this.name = name || 'No name given';

		function createColumn() {
			    // CREATING COMPONENTS OF COLUMNS
			var $column = $('<div>').addClass('column');
			var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
			var $columnCardList = $('<ul>').addClass('column-card-list');
			var $columnDelete = $('<button>').addClass('btn-delete').text('x');
			var $columnAddCard = $('<button>').addClass('add-card').text('Add a card');

			    // ADDING EVENTS	
			$columnDelete.click(function() {
				self.deleteColumn();
			});

				$columnAddCard.click(function(event) {
					var cardName = prompt("Enter the name of the card");
					event.preventDefault();
					$.ajax({
    					url: baseUrl + '/card',
    					method: 'POST',
    					data: {
    						name: cardName,
    						bootcamp_kanban_column_id: self.id
    					},
    					success: function(response) {
        					var card = new Card(response.id, cardName);
        					self.createCard(card);
    					}
					});
				});

			    // CONSTRUCTION COLUMN ELEMENT
			$column.append($columnTitle)
				   .append($columnDelete)
				   .append($columnAddCard)
				   .append($columnCardList);

			    // RETURN OF CREATED COLUMN
			return $column;
		}   
	}
		//ADD PROTOTYPES
		Column.prototype = {
			addCard: function(card) {
				this.$element.children('ul').append(card.$element);
			},

			deleteColumn: function() {
    			var self = this;
    			$.ajax({
      				url: baseUrl + '/column/' + self.id,
      				method: 'DELETE',
      				success: function(response){
        				self.element.remove();
      				}
    			});
 			}
		}; 

	function Card(id, name) {
		var self = this;
		this.id = id;
		this.name = name || 'No name given';

		function createCard() {
			// CREATING THE BLOCKS
    		var $card = $('<li>').addClass('card');
    		var $cardDescription = $('<p>').addClass('card-description').text(self.name);
    		var $cardDelete = $('<button>').addClass('btn-delete').text('x');

    		// BINDING TO CLICK EVENT
    		$cardDelete.click(function(){
        		self.removeCard();
			});

    		// COMBINING BLOCKS AND RETURNING THE CARD
			$card.append($cardDelete)
				 .append($cardDescription);
				
			return $card;
		}

		Card.prototype = {
			removeCard: function() {
				var self = this;
    			$.ajax({
      				url: baseUrl + '/card/' + self.id,
      				method: 'DELETE',
      				success: function(){
        				self.$element.remove();
      				}
    			});
			}
		}
	}

	var board = {
		name: 'Kanban Board',
		addColumn: function(column) {
			this.$element.append(column.$element);
			initSortable();
		},
		$element: $('#board .column-container')
	};

	function initSortable() {
   		$('.column-card-list').sortable({
     		connectWith: '.column-card-list',
     		placeholder: 'card-placeholder'
   		}).disableSelection();
 	}

 	$('.create-column').click(function(){
		var columnName = prompt('Enter a column name');
		$.ajax({
    		url: baseUrl + '/column',
    		method: 'POST',
    		data: {
            	name: columnName
    		},
    		success: function(response){
    			var column = new Column(response.id, columnName);
    			board.createColumn(column);
          	}
        });
 	});
});