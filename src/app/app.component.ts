import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { OuiDialog, OuiSort } from 'projects/ui/src/lib/oui';
import {
  OuiIconRegistry,
  OuiTableDataSource,
  OuiPaginator
} from 'projects/ui/src/lib/oui';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormControl,
  Validators,
  NgForm,
  FormGroupDirective
} from '@angular/forms';
import { ErrorStateMatcher } from 'projects/ui/src/lib/oui/core';
import { ICONS } from 'projects/ui/src/lib/oui/core/shared/icons';

export interface State {
  flag: string;
  name: string;
  population: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface Bank {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray'
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  @ViewChild(OuiSort, { static: true }) sort: OuiSort;
  @ViewChild(OuiPaginator, { static: true }) paginator: OuiPaginator;
  options: string[] = ['One', 'Two', 'Three'];
  minDate = new Date();
  isDisable = false;
  selected = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid')
  ]);
  selectedOption = 'option2';
  selectedOption1 = 'option3';
  matcher = new MyErrorStateMatcher();
  /** list of banks */
  banks: Bank[] = [
    { name: 'Bank A (Switzerland)', id: 'A' },
    { name: 'Bank B (Switzerland)', id: 'B' },
    { name: 'Bank C (France)', id: 'C' },
    { name: 'Bank D (France)', id: 'D' },
    { name: 'Bank E (France)', id: 'E' },
    { name: 'Bank F (Italy)', id: 'F' },
    { name: 'Bank G (Italy)', id: 'G' },
    { name: 'Bank H (Italy)', id: 'H' },
    { name: 'Bank I (Italy)', id: 'I' },
    { name: 'Bank J (Italy)', id: 'J' },
    { name: 'Bank K (Italy)', id: 'K' },
    { name: 'Bank L (Germany)', id: 'L' },
    { name: 'Bank M (Germany)', id: 'M' },
    { name: 'Bank N (Germany)', id: 'N' },
    { name: 'Bank O (Germany)', id: 'O' },
    { name: 'Bank P (Germany)', id: 'P' },
    { name: 'Bank Q (Germany)', id: 'Q' },
    { name: 'Bank R (Germany)', id: 'R' }
  ];
  bankid = 'O';
  bankid1 = 'N';
  bankIds = ['P', 'Q', 'R'];
  opt = 'option2';
  toppings = new FormControl();
  panelColor = new FormControl('red');
  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
    'Extra cheese2',
    'Mushroom2',
    'Onion2',
    'Pepperoni3',
    'Sausage2',
    'Tomato1'
  ];
  test = 'Pepperoni3';
  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];
  stateGroups = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut']
    },
    {
      letter: 'D',
      names: ['Delaware']
    },
    {
      letter: 'F',
      names: ['Florida']
    }
  ];

  pokemonGroups = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' }
      ]
    },
    {
      name: 'Water',
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' }
      ]
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' }
      ]
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' }
      ]
    }
  ];
  disableSelect = new FormControl(false);

  checked;
  labelPosition;
  disabled;
  @ViewChild('dialogTemplate', { static: true })
  dialogTemplate;
  @ViewChild('progressButton', { static: true })
  progressButton: any;
  @ViewChild('progressLinkButton', { static: true })
  progressLinkButton: any;
  @ViewChild('progressGhostButton', { static: true })
  progressGhostButton: any;
  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: OuiTableDataSource<UserData>;
  constructor(
    private dialog: OuiDialog,
    private ouiIconRegistry: OuiIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.ouiIconRegistry.addSvgIcon(
      `horizontal`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/3-dots-horizontal-20x8.svg`
      )
    );
    this.ouiIconRegistry.addSvgIconLiteral(
      `down-arrow`,
      this.domSanitizer.bypassSecurityTrustHtml(ICONS.DOWN_ARROW)
    );

    this.ouiIconRegistry.addSvgIcon(
      `vertical`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        `/assets/images/3-dots-vertical-20x8.svg`
      )
    );
    this.ouiIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'https://s3.amazonaws.com/icomoon.io/135790/oncehub-20/symbol-defs.svg?nhbz3f'
      )
    );

    this.checked = false;
    this.labelPosition = 'after';
    this.disabled = false;
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) =>
      this.createNewUser(k + 1)
    );
    this.dataSource = new OuiTableDataSource(users);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      panelClass: 'something'
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  createNewUser(id: number): UserData {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
      ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
      '.';

    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }

  progressButtonClick() {
    this.progressButton.setToProgress();
    setTimeout(() => {
      this.progressButton.setToDone();
    }, 1000);
  }

  progressButtonLinkClick() {
    this.progressLinkButton.setToProgress();
    setTimeout(() => {
      this.progressLinkButton.setToDone();
    }, 1000);
  }

  func($event) {
    console.log($event);
  }

  progressButtonGhostClick() {
    this.progressGhostButton.setToProgress();
    setTimeout(() => {
      this.progressGhostButton.setToDone();
    }, 1000);
  }

  selectChangeOption($event) {
    console.log('You have selected ', $event);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne === objTwo;
    }
  }

  reset() {
    this.selectedOption = 'option3';
  }

  reset3() {
    this.bankid1 = 'P';
  }
}
