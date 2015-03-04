var distPath = '../../../dist',
  testPath = distPath + '/test',
  spyOnBackbone = require('./backboneSpy');

describe('A Form Model during initialization', function() {
  var FormModel, TestModel, testModel, TestModel2, testModel2, env;

  beforeEach(function(done) {
    require('./clientEnv')().done(function(environment) {
      env = environment;
      FormModel = env.window.Torso.Models.Form;
      TestModel = require(testPath + '/TestModel')(env.window.Torso.Models.Nested),
      TestModel2 = require(testPath + '/TestModel2')(env.window.Torso.Models.Nested),
      testModel = new TestModel();
      testModel2 = new TestModel2();
      done();
    });
  });

  it('can be initialized without an object model', function() {
    var emptyFormModel = new FormModel();
    expect(emptyFormModel).toBeDefined();
  });

  it('can be passed initial values', function() {
    var formModel = new FormModel(null, {model: testModel});
    expect(formModel.get('foo')).toBe(123);
    expect(formModel.get('bar')).toBe('test');
    formModel = new FormModel({}, {model: testModel});
    expect(formModel.get('foo')).toBe(123);
    expect(formModel.get('bar')).toBe('test');
    formModel = new FormModel({foo: 555}, {model: testModel});
    expect(formModel.get('foo')).toBe(555);
    expect(formModel.get('bar')).toBe('test');
  });

  it('can be extended and reused', function() {
    var simpleForm, SimpleForm, formModel2, myProfileFormModel,
      MyProfileFormModel = FormModel.extend({
        mapping: function() {
          return {
            models: [{model: testModel, fields: ['foo']}, {model: testModel2, fields: ['baz']}],
            computed: [{
              models: [{model: testModel, fields: ['bar']}],
              pull: function(bar) {
                var bazTaz = bar.split(/[ ]+/);
                this.set('baz', bazTaz[0]);
                this.set('taz', bazTaz[1]);
              },
              push: function(models) {
                models[0].set('bar', this.get('baz') + ' ' + this.get('taz'));
              }
            },
            {
              models: [{model: testModel2, fields: ['color']}],
              pull: function(color) {
                var colors = color.split(/[ ]+/);
                this.set('primary', colors[0]);
                this.set('secondary', colors[1]);
              },
              push: function(models) {
                models[0].set('color', this.get('primary') + ' ' + this.get('secondary'));
              }
            }]
          }
        }
      });
    myProfileFormModel = new MyProfileFormModel();
    expect(myProfileFormModel._modelConfigs.length).toBe(2);
    expect(myProfileFormModel._computed.length).toBe(2);

    formModel2 = new MyProfileFormModel({}, {model: testModel, fields: ['foo']});
    expect(formModel2._modelConfigs.length).toBe(1);
    expect(formModel2._computed.length).toBe(2);

    SimpleForm = FormModel.extend({
      tracking: {
        model: testModel,
        fields: ['foo']
      }
    });

    simpleForm = new SimpleForm({}, {models: [{model: testModel, fields: ['bar']}, {model: testModel2}]});
    expect(simpleForm._modelConfigs.length).toBe(2);
    expect(simpleForm._modelConfigs[0].fields[0]).toBe('bar');
    expect(simpleForm._computed.length).toBe(0);
  });

  it('can use nested backbone correctly', function() {
    expect(testModel.has('obj.a')).toBe(true);
  });
});