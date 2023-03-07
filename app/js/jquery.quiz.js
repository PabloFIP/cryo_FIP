if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function( $, window, document, undefined){

	var Quiz = {
		init: function(options, elem) {
			var self = this;	

			self.elem = elem;
			self.$elem = $(elem);

			self.options = $.extend( {}, $.fn.quiz.options, options );

			self.shuffleData();
			self.n = 0;
			self.current = self.options.data[self.n];
			self.correct = $('<i class="ok sign icon green large"></i>');
			self.incorrect = $('<i class="attention icon red large"></i>');
			self.$messageContainer = $(self.options.messageContainer);
			self.$imgContainer = $(self.options.imgContainer);

			self.display();

			self.$cancerQuestion = $(self.options.cancerQuestion);
			self.$lesionQuestion = $(self.options.lesionQuestion);
			self.$cryoQuestion = $(self.options.cryoQuestion);
			self.$showUEC = $(self.options.showUEC);

			self.$lesionQuestion.hide();
			self.$cryoQuestion.hide();

			self.$elem.find('.question button').on('click',function(){
				$this = $(this);
				$this.siblings('i').remove();
				// $this.siblings('button').removeClass('positive').removeClass('negative');
				$this.siblings('button').removeClass('blue');
				$this.addClass('blue');

				self.$messageContainer.find('.message').hide();

				if (self.current[$this.attr('name')] == $this.val()) {
					$this.closest('div').append(self.correct.clone().get(0));
				} else {
					$this.closest('div').append(self.incorrect.clone().get(0));
					self.$messageContainer.find('.' + $this.attr('name')).show();
				}

				// $this.addClass( ($this.val() == 1) ? 'positive' : 'negative' );

			});

			self.$cancerQuestion.find('button').on('click', function(){
				$this = $(this);
				var correct = (self.current['cancer'] == 0 && $this.val() == 0);
				self.$lesionQuestion.toggle(correct);
				self.$cryoQuestion.toggle(correct);
			});

			self.$lesionQuestion.find('button').on('click', function(){
				$this = $(this);
				if (self.current.lesion) {
					self.$imgContainer.find('#lesionimage').show();
				}
			});

			self.$showUEC.on('click', function(){
				self.$imgContainer.find('#uecimage').toggle();
			});

			self.$elem.find('.next').on('click',function(){
				self.next();
			});
		},

		display: function() {
			self = this;
			// self.$elem.html('');	
			// $('<img class="" src="data/images/full/' + self.current.image + '" />')
				// .attr('data-cancer', self.current.cancer)
				// .attr('data-lesion', self.current.lesion)
				// .appendTo(self.$imgContainer);
			self.$imgContainer.html(
				$('<img class="" src="data/images/' + self.current.image + '" />')
					.attr('data-cancer', self.current.cancer)
					.attr('data-lesion', self.current.lesion)
				);
			if (self.current.uec) self.$imgContainer.append('<img id="uecimage" class="overlay" style="display:none;" src="data/images/' + self.current.uecimage + '" />');
			if (self.current.lesion == 1) self.$imgContainer.append('<img id="lesionimage" class="overlay" style="display:none;" src="data/images/' + self.current.lesionimage + '" />');
		},

		shuffleData: function() {
			self = this;
			var array = self.options.data;
			var m = array.length, t, i;
			while (m) {
				i = Math.floor(Math.random() * m--);
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}
			self.options.data = array;
		},

		next: function() {
			self.n = (self.n + 1) % self.options.data.length;
			self.current = (self.options.data[self.n]);
			self.reset();
			self.display();
		}, 

		reset: function() {
			self = this;
			self.$elem.find('.question button').removeClass('blue');
			self.$elem.find('.question button').removeClass('blue');
			self.$elem.find('.icon.attention').remove();
			self.$elem.find('.icon.ok').remove();
			self.$messageContainer.find('div.message').hide();
			self.$lesionQuestion.hide();
			self.$cryoQuestion.hide();
		}

	};

	$.fn.quiz = function( options ) {
		return this.each(function(){
			var instance = Object.create(Quiz);
			instance.init(options, this);
			$.data(this, 'quiz', instance);
		});
	}	

	$.fn.quiz.options = {
		timer: false,
		data: '',
		cancerQuestion: '#cancer',
		lesionQuestion: '#lesion',
		cryoQuestion: '#cryo',
		showUEC: '#uec',
		messageContainer: '.messages',
		imgContainer: '.imgContainer'

	}

})(jQuery, window, document);