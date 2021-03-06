Meteor.methods({
});

allChildren = function(id){
  var newChildren = Flows.find({parent:id}).fetch();
  var current =  Flows.findOne({_id:id});
  if(!newChildren) return current;

  current.children = _.map( (newChildren), function(child){
    return allChildren( child._id, current);
  });
  return current;
};




