/**
 * Created by thinhlam on 10/16/15.
 */
(function() {
    var guid = 1;

    var app = angular.module('DragDropApp', ['ui.sortable']);

    app.controller('DragDropCtrl', function($scope) {
        $scope.dragElements = [{
            'Name': "Single Text",
            'Type': "text",
            'Settings': [{
                'Name': 'Field Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': 'xSingle_Text',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Single Text',
                'Type': 'string'
            }, {
                'Name': 'Single Line Text Options',
                'Value': '',
                'Type': 'label'
            }, {
                'Name': 'Max Input Length',
                'Value': '50',
                'Type': 'text'
            }, {
                'Name': 'Url Template',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }]
        }];

        $scope.formFields = [];

        $scope.current_field = {};

        var createNewField = function() {
            return {
                'id': ++guid,
                'Name': '',
                'Settings': [],
                'Active': true,
                'ChangeFieldSetting': function(Value, SettingName) {
                    switch (SettingName) {
                        case 'Field Label':
                        case 'Short Label':
                        case 'Internal Name':
                            $scope.current_field.Name = Value;
                            $scope.current_field.Settings[0].Value = $scope.current_field.Name;
                            $scope.current_field.Settings[1].Value = $scope.current_field.Name;
                            $scope.current_field.Settings[2].Value = 'x' + $scope.current_field.Name.replace(/\s/g, '_');
                            break;
                        default:
                            break;
                    }
                },
                'GetFieldSetting': function(settingName) {
                    var result = {};
                    var settings = this.Settings;
                    $.each(settings, function(index, set) {
                        if (set.Name == settingName) {
                            result = set;
                            return;
                        }
                    });
                    if (!Object.keys(result).length) {
                        //Continue to search settings in the checkbox zone
                        $.each(settings[settings.length - 1].Options, function(index, set) {
                            if (set.Name == settingName) {
                                result = set;
                                return;
                            }
                        });
                    }
                    return result;

                }
            };
        }

        $scope.changeFieldName = function(Value) {
            $scope.current_field.Name = Value;
            $scope.current_field.Settings[0].Value = $scope.current_field.Name;
            $scope.current_field.Settings[1].Value = $scope.current_field.Name;
            $scope.current_field.Settings[2].Value = 'x' + $scope.current_field.Name.replace(/\s/g, '_');
        }

        $scope.removeElement = function(idx){
            if($scope.formFields[idx].Active) {
                $('#addFieldTab_lnk').tab('show');
                $scope.current_field = {};

            }
            $scope.formFields.splice(idx, 1);
        };

        $scope.addElement = function(ele, idx) {
            $scope.current_field.Active = false;

            $scope.current_field = createNewField();
            //Merge setting from template object
            angular.merge($scope.current_field, ele);

            if (typeof idx == 'undefined') {
                $scope.formFields.push($scope.current_field);
            } else {
                $scope.formFields.splice(idx, 0, $scope.current_field);
                $('#fieldSettingTab_lnk').tab('show');
            }

        };

        $scope.activeField = function(f) {
            $scope.current_field.Active = false;
            $scope.current_field = f;
            f.Active = true;
            $('#fieldSettingTab_lnk').tab('show');
        };

        $scope.formbuilderSortableOpts = {
            'ui-floating': true,

        };
    });

    app.directive('elementDraggable', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {
                element.on('dragstart', function(event) {

                    event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
                });
            }
        };
    }]);

    app.directive('elementDrop', ['$document', function($document) {
        return {
            link: function(scope, element, attr) {

                element.on('dragover', function(event) {
                    event.preventDefault();
                });

                $('.drop').on('dragenter', function(event) {
                    event.preventDefault();
                })
                element.on('drop', function(event) {
                    event.stopPropagation();
                    var self = $(this);
                    scope.$apply(function() {
                        var idx = event.originalEvent.dataTransfer.getData('templateIdx');
                        var insertIdx = self.data('index')
                        scope.addElement(scope.dragElements[idx], insertIdx);
                    });
                });
            }
        };
    }]);

})();

$(function() {
    // Code here
    var dh = $(document).height();
    $('#sidebar-tab-content').height(dh - 115);
    $('#main-content').height(dh - 10);
});