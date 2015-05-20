Draggable rows plugin for ui-grid
=================================

Play with HTML5 _drag and drop_ in angular ui-grid.

## Install
Install through bower

```sh
bower install ui-grid-draggable-rows
```

Add plugin as dependency to your module

```js
angular.module("app", ["ui.grid", "ui.grid.draggable-rows"]);
```

## Usage
To add _drag and drop_ functionality you have to insert `ui-grid-draggable-rows` directive to your table.

```html
<div ui-grid="gridOptions" class="grid" ui-grid-draggable-rows></div>
```

Now, you have to add draggable wrapper to your `rowTemplate`. If you have your own template just replace the inner div.

```html
$scope.gridOptions = {
    rowTemplate: '<div draggable-id="{{ row.id }}" grid="grid" class="ui-grid-draggable-row" draggable="true"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell></div></div>'
};
```


Out of the box this plugin does nothing with draggable rows - instead it raise a lot of events. To add action after dropping row register new listener on `rowDropped` event.

```js
$scope.gridOptions.onRegisterApi = function (gridApi) {
    gridApi.draggableRows.on.rowDropped($scope, function (droppedRow, target) {
        // Now you can update the position or do something else
        // droppedRow and target variables are DOM elements
        // to extract row id just use getAttrbiute("draggable-id")

        var droppedId = droppedRow.getAttribute("draggable-id");
        var targetId = target.getAttribute("draggable-id");

        console.log("Dropped");
    });
};
```

## List of events

| Event         | Listener                     | Original event   | Description                                 |
|---------------|------------------------------|------------------|---------------------------------------------|
| rowDragged    | function(draggedRow)         | onDragStart      | Fired once during start dragging            |
| rowEnterRow   | function(draggedRow, row)    | onDragEnter      | Fired when draggable row enter on other row |
| rowOverRow    | function(draggedRow, row)    | onDragOver       | Fired when draggable row is over other row  |
| rowLeavesRow  | function(draggedRow, row)    | onDragLeave      | Fired when draggable row leaves other row   |
| rowFinishDrag | function()                   | onDragEnd        | Fired after finish dragging                 |
| rowDropped    | function(droppedRow, target) | onDrop           | Fired when row is dropping to other row     |

To listen these events just register new listener via _ui-grid_ API.

```js
$scope.gridData.onRegisterApi = function (gridApi) {
    gridApi.draggableRows.on.rowDragged($scope, function savePosition(draggedRow) {
        console.log("Start dragging...");

        // do something else
    });
};
```

## Todo
- [ ] automatically insert the required template row
- [ ] write test _(better late than never)_
- [ ] improve documentation

## Author
This plugin has been orginally developed by [Szymon Krajewski](https://github.com/skrajewski)

## License
The MIT License &copy; 2015
