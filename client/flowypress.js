Template.flows.helpers({
  getRoot: function() {
    console.log(this);
    console.log('getting root', this.rootId)
    return Flows.find({
      _id: this.rootId
    }, {
      limit: 1
    })
  },
  flows: function(id) {
    return Flows.find({
      parent: {
        $exists: false
      }
    }, {
      sort: {
        title: 1
      }
    })
  },
  previousFlow: function() {
    return Session.get('previousFlow')
  }
})

Template.flows.events({
  'click .newFlow': function(e, t) {
    Flows.insert({
      title: "new flow"
    })
  },
  'click .focus': function(e, t) {
    console.log('focus', this._id)
    Session.set('previousFlow', this._id)
    Router.go('/shared/' + this._id)
  },
  'click .trash': function(e, t) {
    console.log('trash', this._id)
      //Session.set('previousFlow', this._id)
      //Router.go('/shared/'+this._id)
    Flows.remove(this._id)
  }
})

Template.flow.helpers({
  flowMenu: function() {
    return Blaze.toHTMLWithData(Template.flowMenu, this)
  }
})

Template.flow.onRendered(function() {
  // return $('[data-toggle="popover"]').popover({
  //   html: true,
  //   placement: 'top'
  // });
  $('[data-toggle="popover"]').popover({
    html: true,
    trigger: 'manual',
    container: $(this).attr('id'),
    placement: 'bottom',
    content: function() {
      $return = '<div class="hover-hovercard"></div>';
    }
  }).on("mouseenter", function() {
    var _this = this;
    $(this).popover("show");
    $(this).siblings(".popover").on("mouseleave", function() {
      $(_this).popover('hide');
    });
  }).on("mouseleave", function() {
    var _this = this;
    setTimeout(function() {
      if (!$(".popover:hover").length) {
        $(_this).popover("hide")
      }
    }, 100);
  });

})

Template.flow.events({
  'click .subFlow': function(e, t) {
    e.preventDefault()
    Flows.insert({
      title: "flow",
      val: "text",
      parent: this._id,
      sortIndex: this.children().count() || 0
    });
    return false
  },
  'keydown .flowTitle': function(event) {
    if (event.keyCode === 13) {
      if (this.parent) {
        Flows.findOne(this.parent).addChild();
      } else {
        Flows.insert({
          title: 'flow',
          val: 'text',
          sortIndex: this.children().count()
        });
      }
      return false;
    }
    if (event.keyCode === 9 && event.shiftKey) {
      Flows.update({
        _id: this._id
      }, {
        $set: {
          parent: Flows.findOne(this.parent).parent || null
        }
      });
      return false;
    } else if (event.keyCode === 9) {
      var parent = Flows.findOne({
        parent: this.parent,
        sortIndex: {
          $lt: this.sortIndex
        }
      });
      if (parent) {
        Flows.update(this._id, {
          $set: {
            parent: parent._id
          }
        });
      }
      return false;
    }
  },
  'blur .flowTitle': function(event) {
    var text;
    text = event.target.innerHTML;
    if (text !== this.title) {
      event.target.innerHTML = '';
    }
    Flows.update(this._id, {
      $set: {
        title: text
      }
    });
  },
  'blur .flowBox': function(event) {
    var text;
    text = event.target.innerHTML;
    if (text !== this.val) {
      event.target.innerHTML = '';
    }
    Flows.update(this._id, {
      $set: {
        val: text
      }
    });
    return false;
  }
})
