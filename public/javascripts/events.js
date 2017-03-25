var Events;

$(function() {

  Events = {
    collection: [],
    $el: $('#events_list'),
    cacheTemplates: function() {
      this.eventsTemplate = Handlebars.compile($('#events').html());
      this.eventTemplate = Handlebars.compile($('#event').html());
      Handlebars.registerPartial('event', $('#event').html());
    },
    retrieve: function() {
      var self = this;

      $.ajax({
        url: '/events',
        success: function(eventsJSON) {
          self.collection = eventsJSON || [];
          self.render();
        }
      });
    },
    validForm: function($form) {
      return $form.serializeArray().every(function(input) {
        return input.value.length;
      });
    },
    new: function(e) {
      e.preventDefault();
      var $form = $(e.target);
      var self = this;

      if (!this.validForm($form)) { return; }
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: $form.serialize(),
        success: function(event) {
          self.add(event);
        }
      });
    },
    add: function(event) {
      this.collection.push(event);
      this.sort();
      this.render();
    },
    sort: function() {
      this.collection = this.collection.sort(function(a, b) {
        return a.date > b.date;
      });
    },
    render: function() {
      this.$el.html(this.eventsTemplate({events: this.collection}));
    },
    bindEvents: function() {
      $('form').on('submit', this.new.bind(this));
    },
    init: function() {
      this.cacheTemplates();
      this.retrieve();
      this.bindEvents();
    }
  };

  Events.init();
});