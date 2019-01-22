The `oui-table` provides data table that can be used to display rows of data.

### **Getting Started**

1. **Write your oui-table and provide data**

Begin by adding the <table oui-table> component and passing the data.

The simplest way to provide data to the table is by passing a data array to the table's `dataSource` input. The table will take the array and render a row for each object in the data array.

```html
<table oui-table [dataSource]="myDataArray">
  ...
</table>
```

Since, the table optimizes for performance, it will not automatically check for changes to the data array. Instead, when objects are added, removed, or moved on the data array, you can trigger an update to the table's rendered rows by calling its `renderRows()` method.

While an array is the simplest way to bind data into the data source, it is also the most limited. For more complex applications, using a `DataSource` instance is recommended. See the section "Advanced data sources" below for more information.

2. **Define the column templates**

Next, write for your table columns templates.

Each column definition should be given a unique name and contain the content for its header and row cells.

Here's a simple column definition with the name `'userName'`. The header cell contains the text "Name" and each row cell will render the name property of each row's data.

```html
<ng-container ouiColumnDef="userName">
  <th oui-header-cell *ouiHeaderCellDef>Name</th>
  <td oui-cell *ouiCellDef="let user">{{user.name}}</td>
</ng-container>
```

3. **Define the row templates**

Finally, once you have defined your columns, you need to tell the table which columns will be rendered in the header and data rows.
To start, create a variable in your component that contains the list of the columns you want to render.

```typescript
columnsToDisplay = ['userName', 'age'];
```

Then add oui-header-row and oui-row to the content of your oui-table and provide your column list as inputs.

```html
<tr oui-header-row *ouiHeaderRowDef="columnsToDisplay"></tr>
<tr oui-row *ouiRowDef="let myRowData; columns: columnsToDisplay"></tr>
```

Note that this list of columns provided to the rows can be in any order, not necessary the order in which you wrote the column definitions. Also, you do not necessarily have to include every column that was defined in your template.

This means that by changing your column list provided to the rows, you can easily re-order and include/exclude columns dynamically.

### Advanced Data Sources

The simplest way to provide data to your table is by passing a data array. More complex use-cases may benefit from a more flexible approach involving an Observable stream or by encapsulating your data source logic into a DataSource class.

**Observable stream of data arrays**

An alternative approach to providing data to the table is by passing an Observable stream that emits the data array to be rendered each time it is changed. The table will listen to this stream and automatically trigger an update to the rows each time a new data array is emitted.

**Data Source**

For most real-world applications, providing the table a DataSource instance will be the best way to manage data. The DataSource is meant to serve a place to encapsulate any sorting, filtering, pagination, and data retrieval logic specific to the application.

A DataSource is simply a base class that has two functions: connect and disconnect. The connect function will be called by the table to receive a stream that emits the data array that should be rendered. The table will call disconnect when the table is destroyed, which may be the right time to clean up any subscriptions that may have been registered during the connect process.

### Features

The `OuiTable` is focused on a single responsibilities: efficiently render rows of data in performant and accessible ways.

You'll notice that the table itself doesn't come out of the box with a lot of features, but expects that the table will be included in a composition of components that fills out its features.

For example, you can add sorting and pagination to the table by using OuiSort and OuiPaginator and mutating the data provided to the table according to their outputs.

**Pagination**

To paginate the table's data, add a <oui-paginator> after the table.

If you are using the OuiTableDataSource for your table's data source, simply provide the OuiPaginator to your data source. It will automatically listen for page changes made by the user and send the right paged data to the table.

Otherwise if you are implementing the logic to paginate your data, you will want to listen to the paginator's (page) output and pass the right slice of data to your table.

**Sorting**

To add sorting behavior to the table, add the ouiSort directive to the table and add oui-sort-header to each column header cell that should trigger sorting. Note that you have to import OuiSortModule in order to initialize the ouiSort directive.

```html
<ng-container ouiColumnDef="position">
  <th oui-header-cell *ouiHeaderCellDef oui-sort-header>Name</th>
  <td oui-cell *ouiCellDef="let element">{{element.position}}</td>
</ng-container>
```

If you are using the `OuiTableDataSource` for your table's data source, provide the `OuiSort` directive to the data source and it will automatically listen for sorting changes and change the order of data rendered by the table.

By default, the `OuiTableDataSource` sorts with the assumption that the sorted column's name matches the data property name that the column displays. For example, the following column definition is named position, which matches the name of the property displayed in the row cell.

Note that if the data properties do not match the column names, or if a more complex data property accessor is required, then a custom sortingDataAccessor function can be set to override the default data accessor on the `OuiTableDataSource`.

**Filtering**

Once-UI does not provide a specific component to be used for filtering the OuiTable since there is no single common approach to adding a filter UI to table data.

A general strategy is to add an input where users can type in a filter string and listen to this input to change what data is offered from the data source to the table.

If you are using the OuiTableDataSource, simply provide the filter string to the
OuiTableDataSource. The data source will reduce each row data to a serialized form and will filter out the row if it does not contain the filter string. By default, the row data reducing function will concatenate all the object values and convert them to lowercase.

For example, the data object {id: 123, name: 'Mr. Smith', favoriteColor: 'blue'} will be reduced to 123mr. smithblue. If your filter string was blue then it would be considered a match because it is contained in the reduced string, and the row would be displayed in the table.

To override the default filtering behavior, a custom `filterPredicate` function can be set which takes a data object and filter string and returns true if the data object is considered a match.

### Selection

Using following steps you can make selection in table.

1. **Add a Selection model**

Get started by setting up a `SelectionModel` from `@angular/cdk/collections` that will maintain the selection state.

```typescript
const initialSelection = [];
const allowMultiSelect = true;
this.selection = new SelectionModel<MyDataType>(
  allowMultiSelect,
  initialSelection
);
```

2. **Define a selection column**

Add a column definition for displaying the row checkboxes, including a master toggle checkbox for the header. The column name should be added to the list of displayed columns provided to the header and data row.

```html
<ng-container ouiColumnDef="select">
  <th oui-header-cell *ouiHeaderCellDef>
    <oui-checkbox
      (change)="$event ? masterToggle() : null"
      [checked]="selection.hasValue() && isAllSelected()"
      [indeterminate]="selection.hasValue() && !isAllSelected()"
    >
    </oui-checkbox>
  </th>
  <td oui-cell *ouiCellDef="let row">
    <oui-checkbox
      (click)="$event.stopPropagation()"
      (change)="$event ? selection.toggle(row) : null"
      [checked]="selection.isSelected(row)"
    >
    </oui-checkbox>
  </td>
</ng-container>
```

3. **Add a event handling logic**

Implement the behavior in your component's logic to handle the header's master toggle and checking if all rows are selected.

```typescript
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

```

### Footer Row

A footer row can be added to the table by adding a footer row definition to the table and adding footer cell templates to column definitions. The footer row will be rendered after the rendered data rows.

```html
<ng-container ouiColumnDef="cost">
  <th oui-header-cell *ouiHeaderCellDef> Cost </th>
  <td oui-cell *ouiCellDef="let data"> {{data.cost}} </td>
  <td oui-footer-cell *ouiFooterCellDef> {{totalCost}} </td>
</ng-container>

...

<tr oui-header-row *ouiHeaderRowDef="columnsToDisplay"></tr>
<tr oui-row *ouiRowDef="let myRowData; columns: columnsToDisplay"></tr>
<tr oui-footer-row *ouiFooterRowDef="columnsToDisplay"></tr
```

### Accessibility

Tables without text or labels should be given a meaningful label via aria-label or aria-labelledby. The aria-readonly defaults to true if it's not set.

Table's default role is grid, and it can be changed to treegrid through role attribute.

oui-table does not manage any focus/keyboard interaction on its own. Users can add desired focus/keyboard interactions in their application.

### Tables with display: flex

The OuiTable does not require that you use a native HTML table. Instead, you can use an alternative approach that uses display: flex for the table's styles.

This alternative approach replaces the native table element tags with the OuiTable directive selectors. For example,

<table oui-table> becomes <oui-table>; <tr oui-row> becomes <oui-row>. The following shows a previous example using this alternative template:

```html
<oui-table [dataSource]="dataSource">
  <!-- User name Definition -->
  <ng-container cdkColumnDef="username">
    <oui-header-cell *cdkHeaderCellDef> User name </oui-header-cell>
    <oui-cell *cdkCellDef="let row"> {{row.username}} </oui-cell>
  </ng-container>

  <!-- Age Definition -->
  <ng-container cdkColumnDef="age">
    <oui-header-cell *cdkHeaderCellDef> Age </oui-header-cell>
    <oui-cell *cdkCellDef="let row"> {{row.age}} </oui-cell>
  </ng-container>

  <!-- Title Definition -->
  <ng-container cdkColumnDef="title">
    <oui-header-cell *cdkHeaderCellDef> Title </oui-header-cell>
    <oui-cell *cdkCellDef="let row"> {{row.title}} </oui-cell>
  </ng-container>

  <!-- Header and Row Declarations -->
  <oui-header-row
    *cdkHeaderRowDef="['username', 'age', 'title']"
  ></oui-header-row>
  <oui-row
    *cdkRowDef="let row; columns: ['username', 'age', 'title']"
  ></oui-row>
</oui-table>
```

Note that this approach means you cannot include certain native-table features such colspan/rowspan or have columns that resize themselves based on their content.

## StackBlitz

[https://stackblitz.com/edit/angular-oui-table-lksdj](https://stackblitz.com/edit/angular-oui-table-lksdj)

# Api Reference

## Classes

**OuiTableDataSource**

Data source that accepts a client-side data array and includes native support of filtering, sorting (using OuiSort),and pagination (using OuiPaginator).

Allows for sort customization by overriding sortingDataAccessor, which defines how data properties are accessed. Also allows for filter customization by overriding filterTermAccessor, which defines how row data is converted to a string for filter matching.

| Name                                                              | Description                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data: T[]                                                         | Array of data that should be rendered by the table, where each object represents one row.                                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                                                                                 |
| filter: string                                                    | Filter term that should be used to filter out objects from the data array. To override how data objects match to this filter string, provide a custom function for filterPredicate.                                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                 |
| filterPredicate: ((data: T, filter: string) => boolean)           | Checks if a data object matches the data source's filter string. By default, each data object is converted to a string of its properties and returns true if the filter has at least one occurrence in that string. By default, the filter string has its whitespace trimmed and the match is case-insensitive. May be overridden for a custom implementation of filter matching.  |                                                                                                                                                                                                                                                                                                                                                 |
| filteredData: T[]                                                 | The filtered set of data that has been matched by the filter string, or all the data if there is no filter. Useful for knowing the set of data the table represents. For example, a 'selectAll()' function would likely want to select the set of filtered data shown to the user rather than all the data.                                                                        |                                                                                                                                                                                                                                                                                                                                                 |
| paginator: OuiPaginator `                                         | ` null                                                                                                                                                                                                                                                                                                                                                                             | Instance of the OuiPaginator component used by the table to control what page of the data is displayed. Page changes emitted by the MatPaginator will trigger an update to the table's rendered data.                                                                                                                                           |
| sort: OuiSort `                                                   | ` null                                                                                                                                                                                                                                                                                                                                                                             | Instance of the OuiSort directive used by the table to control its sorting. Sort changes emitted by the OuiSort will trigger an update to the table's rendered data.                                                                                                                                                                            |
| sortData: ((data: T[], sort: OuiSort) => T[])                     | Gets a sorted copy of the data array based on the state of the OuiSort. Called after changes are made to the filtered data or when sort changes are emitted from OuiSort. By default, the function retrieves the active sort and its direction and compares data by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation of data ordering. |                                                                                                                                                                                                                                                                                                                                                 |
| sortingDataAccessor: ((data: T, sortHeaderId: string) => string ` | ` number)                                                                                                                                                                                                                                                                                                                                                                          | Data accessor function that is used for accessing data properties for sorting through the default sortData function. This default function assumes that the sort header IDs (which defaults to the column name) matches the data's properties (e.g. column Xyz represents data['Xyz']). May be set to a custom function for different behavior. |
