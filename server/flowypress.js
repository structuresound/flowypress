var Api;

Api = new Restivus({
  apiPath: '/',
  useDefaultAuth: true,
  prettyJson: true
});

Api.addRoute('v1/flow-id/:flowId', {
  authRequired: false,
  enableCors: true
}, {
  get: function() {
    var flow,
      flowId = this.urlParams.flowId;

    check(flowId, String);

    flow = Flows.findOne({
      _id: flowId
    });
    if (flow) {
      return flow;
    }
    return {
      error: "can't find flow for id: " + flowId
    };
  }
});

Meteor.startup(function() {
  if (!Flows.findOne()) {
    var parent = Flows.insert({
      title: "firstFlow"
    })

    var child = Flows.insert({
      parent: parent,
      title: "secondFlow"
    })
  }
})
