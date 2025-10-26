const departments = [
  { id: 1, name: 'IT Application & Data Services' },
  { id: 2, name: 'Head Start' },
  { id: 3, name: 'Corrections Education Division' },
  { id: 4, name: 'Occupational Safety & Health' },
  { id: 5, name: 'Special Academic Program' },
  { id: 6, name: 'Vice Pres Stu Services Office' },
  { id: 7, name: 'Business Info Tech-Bus Div' },
  { id: 8, name: 'Chemistry/STEM Div' },
  { id: 9, name: 'Family Life Education-HHS Div' },
  { id: 10, name: 'Sci/Tech/Eng/Math Div (STEM)' },
  { id: 11, name: 'Biology-STEM Div' },
];

const positions = [
  { id: 1, title: 'IT Data Management - SR.', departmentId: 1 },
  { id: 2, title: 'EDUCATION SITE MANAGER', departmentId: 2 },
  { id: 3, title: 'ASSOC DEAN CORRECTIONS EDU', departmentId: 3 },
  { id: 4, title: 'DIRECTOR OSH PROGRAM', departmentId: 4 },
  { id: 5, title: 'DIR, SPECIAL ACADEMIC PROG', departmentId: 5 },
  { id: 6, title: 'EXEC ASST VP STU SUCCESS', departmentId: 6 },
  { id: 7, title: 'FULL TIME FACULTY - Business', departmentId: 7 },
  { id: 8, title: 'FULL TIME FACULTY - Chemistry', departmentId: 8 },
  { id: 9, title: 'FULL TIME FACULTY - Family Life', departmentId: 9 },
  { id: 10, title: 'DEAN SCI TECH ENG MATH DIV', departmentId: 10 },
  { id: 11, title: 'FULL TIME FACULTY - Biology', departmentId: 11 },
];

const employees = [
  { id: 101000942, firstName: 'Elaine', lastName: 'Durham', email: 'Elaine.Durham@YourCollege.edu', hireDate: '2020-08-15', positionId: 1, address1: '14917 19TH AVE W', city: 'POST FALLS', state: 'ID', postal: '83854' },
  { id: 101009472, firstName: 'Christopher', lastName: 'Osorio', email: 'Christopher.Osorio@SomeWhere.com', hireDate: '2019-05-20', positionId: 2, address1: '16510 76TH AVE W.', city: 'SULTA', state: 'WA', postal: '98294' },
  { id: 101014387, firstName: 'Michael', lastName: 'Johanse', email: 'Michael.Johansen@YourCollege.edu', hireDate: '2021-01-10', positionId: 3, address1: '5832 136th St SE', city: 'EDMONDS', state: 'WA', postal: '98026' },
  { id: 101017102, firstName: 'Theresa', lastName: 'Merry', email: 'Theresa.Merry@YourCollege.edu', hireDate: '2022-06-01', positionId: 4, address1: '19501 40th Ave W Unit 623', city: 'SEATTLE', state: 'WA', postal: '98107' },
  { id: 101018013, firstName: 'Sharo', lastName: 'lden-Novak', email: 'Sharon.lden-Novak@YourCollege.edu', hireDate: '2018-11-22', positionId: 5, address1: '15305 Highway 99 Apt 25', city: 'SEATTLE', state: 'WA', postal: '98115' },
  { id: 101020004, firstName: 'Linda', lastName: 'Liddell', email: 'Linda.Liddell@YourCollege.edu', hireDate: '2017-03-14', positionId: 6, address1: '7028 208th St SW Unit 4', city: 'EDMONDS', state: 'WA', postal: '98026' },
  { id: 101021259, firstName: 'Catherine', lastName: 'Pa', email: 'Catherine.Pan@YourCollege.edu', hireDate: '2023-09-01', positionId: 7, address1: '2414 136th Pl SE', city: 'Hansville', state: 'WA', postal: '98340-7762' },
  { id: 101021283, firstName: 'Heather', lastName: 'Edli', email: 'Heather.Edlin@YourCollege.edu', hireDate: '2022-08-20', positionId: 8, address1: '23711 45TH COURT WEST', city: 'SEATTLE', state: 'WA', postal: '98125' },
  { id: 101021853, firstName: 'Verno', lastName: 'Burdick', email: 'Vernon.Burdick@SomeWhere.com', hireDate: '2021-02-18', positionId: 9, address1: '2530 187TH PLACE SE', city: 'EDMONDS', state: 'WA', postal: '98020' },
  { id: 101022339, firstName: 'Tucker', lastName: 'nzalez', email: 'Tucker.nzalez@YourCollege.edu', hireDate: '2023-07-15', positionId: 10, address1: '19729 71ST PL W', city: 'SEATTLE', state: 'WA', postal: '98177' },
  { id: 101022421, firstName: 'Amber', lastName: 'Martinez Hurtado', email: 'Amber.MartinezHurtado@YourCollege.edu', hireDate: '2023-08-20', positionId: 8, address1: '2412 200TH PLACE SW', city: 'LAKE FOREST PARK', state: 'WA', postal: '98155' },
  { id: 101023474, firstName: 'Joan', lastName: 'Cossette', email: 'Joann.Cossette@YourCollege.edu', hireDate: '2022-09-01', positionId: 11, address1: '1093 DISCOVERY RIDGE RD', city: 'BOTHELL', state: 'WA', postal: '98012' },
];

const courses = [
  { id: 1, name: 'Annual Security Training', description: 'Mandatory annual security and threat awareness training.' },
  { id: 2, name: 'Data Privacy Fundamentals (FERPA)', description: 'Understanding student data privacy regulations.' },
  { id: 3, name: 'Advanced Database Systems', description: 'Deep dive into database management and optimization.' },
  { id: 4, name: 'Student Support Services', description: 'Best practices for supporting student success.' },
  { id: 5, name: 'Leadership & Management Essentials', description: 'Core principles of effective leadership and team management.' },
  { id: 6, name: 'Workplace Safety (OSHA)', description: 'Guidelines for maintaining a safe work environment.' },
  { id: 7, name: 'Curriculum Design & Development', description: 'Principles of creating effective educational curricula.' },
  { id: 8, name: 'New Faculty Onboarding', description: 'Orientation and training for new faculty members.' },
  { id: 9, name: 'Financial Management for Deans', description: 'Budgeting and financial oversight for division leaders.' },
];

let positionCourses = [
  // All employees must take Annual Security Training
  ...Array.from({ length: 11 }, (_, i) => ({ positionId: i + 1, courseId: 1 })),

  // Role-specific training
  { positionId: 1, courseId: 2 }, // IT Data Management
  { positionId: 1, courseId: 3 },
  { positionId: 2, courseId: 4 }, // EDUCATION SITE MANAGER
  { positionId: 2, courseId: 5 },
  { positionId: 3, courseId: 5 }, // ASSOC DEAN
  { positionId: 3, courseId: 7 },
  { positionId: 4, courseId: 5 }, // DIRECTOR OSH
  { positionId: 4, courseId: 6 },
  { positionId: 5, courseId: 5 }, // DIR, SPECIAL ACADEMIC PROG
  { positionId: 6, courseId: 2 }, // EXEC ASST VP
  { positionId: 7, courseId: 8 }, // Faculty
  { positionId: 8, courseId: 8 }, // Faculty
  { positionId: 9, courseId: 8 }, // Faculty
  { positionId: 11, courseId: 8 }, // Faculty
  { positionId: 10, courseId: 5 }, // DEAN
  { positionId: 10, courseId: 9 },
];

let employeeCourseAssignments = [];

const employeeTrainings = [
  // Elaine Durham (IT)
  { employeeId: 101000942, courseId: 1, completionDate: '2023-01-15' },
  { employeeId: 101000942, courseId: 2, completionDate: '2023-03-20' },

  // Christopher Osorio (Edu Manager)
  { employeeId: 101009472, courseId: 1, completionDate: '2023-02-10' },
  { employeeId: 101009472, courseId: 4, completionDate: '2023-04-05' },
  { employeeId: 101009472, courseId: 5, completionDate: '2023-06-11' },

  // Michael Johanse (Assoc Dean)
  { employeeId: 101014387, courseId: 5, completionDate: '2023-05-18' },
  
  // Theresa Merry (OSH Director)
  { employeeId: 101017102, courseId: 1, completionDate: '2023-07-01' },
  { employeeId: 101017102, courseId: 6, completionDate: '2023-08-22' },

  // Sharo lden-Novak (Spec Prog Director)
  { employeeId: 101018013, courseId: 1, completionDate: '2023-01-30' },

  // Linda Liddell (Exec Asst) has completed all
  { employeeId: 101020004, courseId: 1, completionDate: '2023-02-28' },
  { employeeId: 101020004, courseId: 2, completionDate: '2023-03-15' },

  // Catherine Pa (Faculty)
  { employeeId: 101021259, courseId: 1, completionDate: '2023-10-05' },
  { employeeId: 101021259, courseId: 8, completionDate: '2023-09-20' },

  // Heather Edli (Faculty)
  { employeeId: 101021283, courseId: 1, completionDate: '2023-01-25' },
];

module.exports = {
    departments,
    positions,
    employees,
    courses,
    positionCourses,
    employeeCourseAssignments,
    employeeTrainings
};
