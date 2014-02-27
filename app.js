var app = angular.module('listloader.app', []);


app.directive('listLoader', ['$timeout', function($timeout) {
    return {
        restrict: "A",
        template: "<div class=\"listLoader\">" +
            "<div ng-repeat=\"object in objects track by $index\">{{displayText(object)}}" +
            "<span ng-hide=\"object.$complete\" style=\"float: right\">loading</span></div>" +
            "<div class=\"listInput\" contenteditable></div>" +
            "</div>",
        scope: {
            objects: "=list",
            property: "@",
            transform: "="
        },
        controller: function($scope) {
            $scope.test = function() {
                $scope.objects.push({text: "I was pushed"});
            }
        },
        link: function(scope, element, attrs) {
            scope.displayText = function(object) {
                //this is a poor way of detecting whether or not
                // the transform is complete.  Rethink
                if (object[scope.property]) {
                    object.$complete = true;
                }

                if (object.$complete) {   
                    return object[scope.property];
                } else {
                    return object.$input;
                }
            };

            var inputDiv = element[0].firstChild.lastChild;
            inputDiv.onkeydown = inputDiv.onkeypress = function(event) {
                if (event.which === 13) {
                    var lines = event.srcElement.innerText.split('\n');
                    angular.forEach(lines, function(line) { 
                        // Angular will create a $watch on each object
                        // since
                        var obj = {
                            $input: line,
                            $complete: false,
                        };

                        scope.$apply(function() {
                            scope.objects.push(obj);
                            scope.transform(line,obj);
                        });

                        // scope.$apply(function() {
                        // })

                        // scope.$evalAsync(function() {
                        //     scope.transform(line,obj);
                        //     // obj.$complete = true;
                        // })

                    });

                    // clear the contenteditable div for next entry
                    event.srcElement.innerText = '';
                    event.preventDefault();                 
                }
            }
        }
    }
}])

app.controller('listloader.ctrl', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.myObjects = [];

    $scope.myTransform = function(inputText, object) {
        $timeout(function() {
            object.text = "I transformed " + inputText;
        }, 1000);
    }

}])


