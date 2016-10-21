var App = angular.module("App", []);
App.controller("Controller", ["$scope", function($scope)
{
    $scope.ImageIn = "filename";
}]);
App.directive("imageShow", ["$parse", function($parse)
{
    var obj = {};
    obj.link = function(inScope, inElement, inAttributes)
    {   
        var canvas;
        var context;
        var getterURL;
        var getterWrite;
        canvas = inElement[0];
        context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;

        $scope.$watch(function(scope)
        {
            var computed = $parse(inAttributes.imageShow)(inScope);
            console.log(computed);
            return computed;
        },
        function(newValue, oldValue)
        {
            var img;
            img = new Image();
            img.onload = function()
            {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);

                setter = $parse(inAttributes.ngOnload);
                setter(inScope)(context.getImageData(0, 0, canvas.width, canvas.height), context, canvas);
                inScope.$apply();
            };
            img.src = getterURL;
        });

        getterURL = $parse(inAttributes.imageShow)(inScope);
        if(getterURL)
        {
            var img;
            img = new Image();
            img.onload = function()
            {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);

                setter = $parse(inAttributes.ngOnload);
                setter(inScope)(context.getImageData(0, 0, canvas.width, canvas.height), context, canvas);
                inScope.$apply();
            };
            img.src = getterURL;
        }

        getterBytes = $parse(inAttributes.ngDrawBytes)(inScope);
        if(getterBytes)
        {
            canvas.width = getterBytes.width;
            canvas.height = getterBytes.height;
            context.putImageData(getterBytes, 0, 0);
        }
    };
    return obj;
}]);
App.directive("imageLoad", ["$parse", function(inParser)
{
    var directive = {};
    directive.link = function(inScope, inElement, inAttributes){

        function handlerEnter(inEvent)
        {
            if(inEvent)
            {
                inEvent.preventDefault();
            }
            inElement.addClass("Import");
            inEvent.dataTransfer.effectAllowed = 'copy';
            return false;
        }
        
        function handlerDrop(inEvent)
        {
            inElement.removeClass("Import");
            if(inEvent)
            {
                inEvent.preventDefault();
            }
            parse(event.dataTransfer.files[0]);
            return false;
        }
        
        function handlerChange(inEvent)
        {
            inEvent.stopImmediatePropagation();
            parse(inEvent.target.files[0]);
        };
        
        function parse(inFile)
        {
            var parser = new FileReader();
            parser.onload = function(inEvent)
            {
                inScope[inAttributes.imageLoad] = parser.result;
                inScope.$apply();
            };
            parser.readAsDataURL(inFile);
        }
        
        function handlerLeave()
        {
            inElement.removeClass("Import");
        }

        inElement.on("dragenter dragstart dragend dragleave dragover drag drop", function (inEvent) {inEvent.preventDefault();});
        inElement.on('dragenter', handlerEnter);
        inElement.on('dragleave', handlerLeave);
        inElement.on('drop', handlerDrop);
        inElement.on('change', handlerChange);
        inElement.on('click', function(inEvent){inEvent.stopImmediatePropagation();})
    };
    
    return directive;
    
}]);