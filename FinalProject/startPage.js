var classes=[];
var students=[];
var body= document.querySelector("body");
var count=0;
var searchClassVal=""
var searchStudentVal=""
var searchStudentId=""

function createClass(name,pointscale){ //creates class object
    this.id="";
    this.name=name;
    this.pointscale=pointscale;
    this.student=[];

}

function addClass(){ // add classes
   let className= document.getElementById("add-className");
   let pointScale=document.getElementById("point-scale");
   if(pointScale.value=="" || className.value==""){ // if values empty
    addAlert("Values cannot be empty!")
    return
   }
   if(pointScale.value !=7 && pointScale.value!=10 && pointScale.value!=""){ //if poinscale not equal to 7 or 10
        addAlert("PointScale must be either 7 or 10")
        return
   }
   
   if(checkClassExist(className.value)){ // if class exist
    addAlert("Class already Exist!")
    return
   }
   else{
    let newClass = new createClass(className.value,pointScale.value);
    newClass.id=count;
    count++;
    addSuccess("Class successfully added!")
    classes.push(newClass);
    className.value=""
    pointScale.value=""
    console.log(classes);
    

   }
}
function checkClassExist(className){ // checks entered name exist or not
    if(classes.length!=0){
        for(let i=0; i<classes.length;i++){
            if(classes[i].name==className){
                return true;
            }
        }
    }
    return false;
}
function deleteClass(){ // bring delete class menu and make it visible
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    let deletes=document.querySelector(".delete-class");
    deletes.style.display="flex"
    if(classes.length==0){
        addAlert("You have not added any classes yet!")
        deletes.style.display="none"
        return
    }
}
function afterDelete(){ // delete class
    let deletes=document.querySelector(".delete-class");
    let deleteValue=document.getElementById("delete-name");
    if(deleteValue.value=="" ){ //if value is null
        addAlert("Value Cannot Be Null!")
        body.style.backgroundColor="rgba(0,0,0,0.5)"
        return
    }
   
    if(classes.length!=0){ // if clases not empty
        for (let i=0;i<classes.length;i++){
            if(classes[i].name==deleteValue.value){
                if(students.length !=0){
                    for(let y=0;y<students.length;y++){
                        let classId=getClassId(deleteValue.value)
                        if(students[y].takingClasses.length!=0){
                            console.log("delete taking course",students[y].takingClasses)
                            let after =students[y].takingClasses.filter((e)=>(e.classId != classId )); // delete tht lectures from all students
                            students[y].takingClasses=after;
                        }
                    }
                }
                if(searchClassVal=="flex"){ // if table displaying and class is removing
                    if(deleteValue.value==upClassName){
                        let tableParent= document.querySelector(".table-class");
                        tableParent.style.display="none"
                    }
                }
                if(searchStudentVal=="flex"){ // if table is deleted while student table displaying
                    getStudentTable(searchStudentId)
                }
                addSuccess("Class successfully deleted!")// add success message
                let newOne=classes.filter((e)=>(e.name!=deleteValue.value)) // deletes that class
                classes=newOne
                body.style.backgroundColor="rgba(0,0,0,0)"
                deletes.style.display="none"
                deleteValue.value=""
                console.log("delete",classes)
                console.log("delete class after students",students)
                return
            }
        }
        addAlert("No className is match!") // if no class is match added alert
        body.style.backgroundColor="rgba(0,0,0,0)"
        deletes.style.display="none"
        deleteValue.value=""
        return
    }
    else{
        
    }
}

function remove(){ // removes alert message
    body.style.backgroundColor="rgba(0,0,0,0)"
    let alerting=document.querySelector(".alert");
    alerting.style.display="none"
}
function addAlert(text){ // adds alert message
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    let alerting=document.querySelector(".alert");
    alerting.style.display="flex"
    let alertingMessage=document.querySelector(".alert-first");
    let newHeadLine= document.createElement("h1");
    alertingMessage.innerHTML=""
    newHeadLine.textContent=text
    alertingMessage.appendChild(newHeadLine)
    setTimeout(()=>{
        remove()
    },3000)
}
function updateClass(){ // brings update class menu
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    let update=document.querySelector(".update-class");
    update.style.display="flex"
    if(classes.length==0){ // if any class is exist
        addAlert("You have not added any classes yet!")
        update.style.display="none"
        return
    }
    
}

function afterUpdate(){ // updates the class
    let update=document.querySelector(".update-class");
    let oldname=document.getElementById("old-name");
    let newname=document.getElementById("new-name");
    if(oldname.value=="" || newname.value==""){ // if values empty adds alert message
        addAlert("Values Cannot Be Null!")
        body.style.backgroundColor="rgba(0,0,0,0.5)"
        return
    }
    
   
    if(classes.length!=0){
        let newArray = classes.filter((e)=>e.name==newname.value); // checks new classname classname
        if(newArray.length!=0){
            addAlert("The new ClassName already exist!") // if newvalue  is exist
            return
        }
        else{
            for (let i=0;i<classes.length;i++){
                if(classes[i].name==oldname.value){
                    classes[i].name=newname.value;
                    if(searchClassVal=="flex"){ // if class table open while changing name it will be re render
                        getClassTable(newname.value)
                    }
                    if(searchStudentVal=="flex"){  // if student table open while changing name it will be re render
                        getStudentTable(searchStudentId)
                    }
                    addSuccess("Class successfully updated!")
                    body.style.backgroundColor="rgba(0,0,0,0)"
                    update.style.display="none"
                    oldname.value=""
                    newname.value=""
                    return
                }
            }
            addAlert("No className is match!") // if there is no match with old value
            body.style.backgroundColor="rgba(0,0,0,0)"
            update.style.display="none"
            return
        }
    }
   
}
function student (no,name,surname){ // creates students
    this.no=no;
    this.name=name;
    this.surname=surname;
    this.gpa="";
    this.takingClasses=[]; // studenttakingcourse object wil be pushed here
    
}
function studentTakingCourse(classId,midterm,final){ // creates students lectures
    this.classId=classId;
    this.midterm=midterm;
    this.final=final;
    this.letterNode="";
}
function beforeAddStudent(){// brings addstudent menu
    if(classes.length==0){ // if there is no class exist
        addAlert("You have not added any classes yet!")
        return;
    }
    let add=document.querySelector(".add-student")
    add.style.display="flex";
    body.style.backgroundColor="rgba(0,0,0,0.5)"
}
function addStudent(){ //add students
    let className=document.getElementById("class-name");
    let no=document.getElementById("no");
    let name=document.getElementById("student-name");
    let surname=document.getElementById("student-surname");
    let midterm=document.getElementById("midterm");
    let final=document.getElementById("final");
    if(className.value=="" || no.value=="" || name.value=="" || surname.value=="" || midterm.value=="" || final.value ==""){
        addAlert("No Value Can Be Empty!")
        body.style.backgroundColor="rgba(0,0,0,0.5)" // if any value is empty
        
    }
    else{
        if(midterm.value<0 || midterm.value>100 || final.value<0 || final.value>100 || no.value<0){ // if any value smaller or greater than zero!
            addAlert("Invalid value!");
            body.style.backgroundColor="rgba(0,0,0,0.5)"
            if(midterm.value<0 || midterm.value>100){
                midterm.value=""
            }
            if(final.value<0  || final.value>100){
                final.value=""
            }
            if(no.value<0){
                no.value=""
            }
        }
        else{
            if(checkClassExist(className.value)){ // if class already exist
                if(checkStudentInTheClass(className.value,no.value)){ // if student already taking that course
                    addAlert("Student Already Taking That Course")
                    body.style.backgroundColor="rgba(0,0,0,0.5)"
                    
                }
                else{
                    if(checkStudentNo(no.value)){ // if student already exist
                        if(getStudent(no.value).name!=name.value || getStudent(no.value).surname !=surname.value){ // if student exist but inputs not matching with itself
                            addAlert("Student already exist name or surname wrong!")
                            body.style.backgroundColor="rgba(0,0,0,0.5)"
                        }
                        else{
                            getAddingClass(getClassId(className.value),no.value);// add student no to that class
                            for(let i=0;i<students.length;i++){
                                if(students[i].no==no.value){
                                    let taking=new studentTakingCourse(getClassId(className.value),midterm.value,final.value); // creates a lecture for that student
                                    let grade = calculateStudentGrade(getClassIndex(className.value),midterm.value,final.value); // calculate student grade
                                    taking.letterNode=grade;
                                    students[i].takingClasses.push(taking) // add that class to that student
                                    
                                    if(searchClassVal=="flex"){ // if class table is opened it will be re render
                                        console.log("insideflex")
                                        getClassTable(upClassName)
                                    }
                                    if(searchStudentVal=="flex"){ // if student table is opened it will be re render
                                        if(no.value==searchStudentId){
                                            getStudentTable(searchStudentId)
                                        }
                                    }
                                    
                                }
                            }
                            addSuccess("Student successfully added!") // adds success message
                            body.style.backgroundColor="rgba(0,0,0,0)"
                            let add=document.querySelector(".add-student")
                            add.style.display="none";
                            name.value=""
                            className.value=""
                            surname.value=""
                            midterm.value=""
                            no.value=""
                            final.value=""
    
                        }
                    }
                    else{ // if student not exist first time adding that student
                        let newStudents = new student(no.value,name.value,surname.value); // creates a new student
                        let courses= new studentTakingCourse(getClassId(className.value),midterm.value,final.value); // create entered lecture for that student
                        let grade = calculateStudentGrade(getClassIndex(className.value),midterm.value,final.value); // calculate its grade
                        courses.letterNode=grade;
                        newStudents.takingClasses.push(courses);
                        students.push(newStudents); // adding that student to student list
                        getAddingClass(getClassId(className.value),no.value) // add student id to that class student array
                        body.style.backgroundColor="rgba(0,0,0,0)"
                        let add=document.querySelector(".add-student")
                        if(searchClassVal=="flex"){ // if class table is opened it will be re render
                            getClassTable(upClassName)
                            console.log("insideflex")
                        }
                        if(searchStudentVal=="flex"){ // if student table is opened it will be re render
                            if(no.value==searchStudentId){
                                getStudentTable(searchStudentId)
                            }
                        }
                        addSuccess("Student successfully added!")
                        add.style.display="none";
                        console.log("classes",classes);
                        console.log("students",students);
                        name.value=""
                        className.value=""
                        surname.value=""
                        midterm.value=""
                        no.value=""
                        final.value=""
    
                        
                    }
                    
                    
                    
                }
            }    
            else{ // if class value is not exist
                addAlert("ClassName does not exist!")
                body.style.backgroundColor="rgba(0,0,0,0.5)"
                
            }
        }
    }
    
}
function checkStudentNo(value){ // checks student exist or not
    for(let i=0;i<students.length;i++){
        if(students[i].no==value){
            return true;
        }
        
    }
    return false;
}
function getStudent(Id){ // gets the student object copy
    for(let i=0;i<students.length;i++){
        if(students[i].no==Id){
            return students[i];
        }
        
    }
    return null;
}
function getAddingClass(Id,student){ //add student id to that class 
    for(let i=0;i<classes.length;i++){
        if(classes[i].id==Id){
            classes[i].student.push(student);
            return;
        }
    }
    

}
function checkStudentInTheClass(value,value1){ //check if student taking that class
    for(let i=0;i<classes.length;i++){
        if(classes[i].name==value){
            if(classes[i].student.length!=0){
                for(let y=0;y<classes[i].student.length;y++){
                    if(classes[i].student[y]==value1){
                        return true;
                    }
                }
            }
        }
        
    }
    return false;
}
function getClassId(className){ //returns class id
    for(let i=0;i<classes.length;i++){
        if(classes[i].name==className){
            return classes[i].id;
        }
        
    }
    return null;
}
function getClassIndex(className){ //returns class id
    for(let i=0;i<classes.length;i++){
        if(classes[i].name==className){
            return i;
        }
        
    }
    return null;
}
function calculateStudentGrade(classIndex,midterm,final){ // claculate student grabe by its midterm final and class's pointscale
    let grade= ((midterm/100)*40)+((final/100)*60)
    console.log("grade",grade)
    let letterGrade="";
    if(classes[classIndex].pointscale==7){
        if(grade>=93){
            letterGrade="A"
            return letterGrade
        }
        if(85<=grade && grade<93){
            letterGrade="B"
            return letterGrade
        }
        if(77<=grade && grade<85){
            letterGrade="C"
            return letterGrade
        }
        if(70<=grade && grade<77){
            letterGrade="D"
            return letterGrade
        }
        if(grade<70){
            letterGrade="F"
            return letterGrade
        }

    }
    if(classes[classIndex].pointscale==10){
        if(grade>=90){
            letterGrade="A"
            return letterGrade
        }
        if(80<=grade && grade<90){
            letterGrade="B"
            return letterGrade
        }
        if(70<=grade && grade<80){
            letterGrade="C"
            return letterGrade
        }
        if(60<=grade && grade<70){
            letterGrade="D"
            return letterGrade
        }
        if(grade<60){
            letterGrade="F"
            return letterGrade
        }

    }
    return letterGrade;

}
function getStudentIndex(studentId){ // bring the student index inside student array
    for(let i=0;i<students.length;i++){
        if(students[i].no==studentId){
            return i;
        }
        
    }
}
function getStudentTakingCourseObject(studentId,classId){ // brings the studentakingcourseobject which matches with st id and class id
    let i = getStudentIndex(studentId);
    let newArray= students[i].takingClasses.filter((e)=>(e.classId == classId));
    return newArray;
}
function bringClass(){ // opens searh class menu
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    if(classes.length==0){
        addAlert("You have not added ayn classes yet!");
        return;

    }
    let tableParent= document.querySelector(".class-table");
    tableParent.style.display="flex";
    
}
function checkTable(){
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    let tableParent= document.querySelector(".class-table");
    let  className= document.getElementById("get-class-name");
    let text= document.querySelector("#table-classname");
    text.textContent=className.value;
    let classExist= classes.filter((e)=>e.name==className.value);
    if(classExist.length !=0){ // if entered classname exist or not 
        tableParent.style.display="none";
        body.style.backgroundColor="rgba(0,0,0,0)"
        addSuccess("Table successfully created!")
        getClassTable(className.value);
        return;

    } // if entered name does not exsist
    else{
        addAlert("Class does not exist!");
        return
    }
}
function getClassTable(className){ // brings classtable depending on entered name and makes table visible
    let doc = document.querySelector(".student-class")
    doc.style.display="none";
    searchStudentId=""
    searchStudentVal=""
    let tableParent=document.querySelector(".table-class");
    let text= document.querySelector("#table-classname");
    text.textContent=className;
    tableParent.style.display="flex"
    searchClassVal="flex"
    let table= document.getElementById("tbodyy");
    table.innerHTML=""
    upClassName=className;
    let classIndex = getClassIndex(className);
    if(classes[classIndex].student.length!=0){ // if class have some students
        for(let i=0;i<classes[classIndex].student.length;i++){
            let classId=getClassId(className);
            let currentStudentId=classes[classIndex].student[i];
            let currentStudent=getStudent(currentStudentId);
            let currentStudentClass=getStudentTakingCourseObject(currentStudentId,getClassId(className)); // brings that student lectures which matches with entered classname
            if(document.getElementById("fail-student").checked){ // if fail student checked
                if(currentStudentClass[0].letterNode=="F"){
                    var row=`
                    <tr> 
                    <td>${currentStudent.no}</td>
                    <td>${currentStudent.name}</td>
                    <td>${currentStudent.surname}</td>
                    <td>${currentStudentClass[0].midterm}</td>
                    <td>${currentStudentClass[0].final}</td>
                    <td>${currentStudentClass[0].letterNode}</td>
                    <td><button onclick="updateStudent(${currentStudent.no},${classId})">Update</button></td>
                    <td><button onclick="deleteStudent(${currentStudent.no})">Delete</button></td>
                    
                    
                    </tr`
                    table.innerHTML +=row;
                }
            }
            else if(document.getElementById("pass-student").checked){ // if pass-student checked
                if(currentStudentClass[0].letterNode!="F"){
                    var row=`
                    <tr> 
                    <td>${currentStudent.no}</td>
                    <td>${currentStudent.name}</td>
                    <td>${currentStudent.surname}</td>
                    <td>${currentStudentClass[0].midterm}</td>
                    <td>${currentStudentClass[0].final}</td>
                    <td>${currentStudentClass[0].letterNode}</td>
                    <td><button onclick="updateStudent(${currentStudent.no},${classId})">Update</button></td>
                    <td><button onclick="deleteStudent(${currentStudent.no})">Delete</button></td>
                    
                    
                    </tr`
                    table.innerHTML +=row;
                }
            }
            else{ // if nothing is checked
                var row=`
                <tr> 
                <td>${currentStudent.no}</td>
                <td>${currentStudent.name}</td>
                <td>${currentStudent.surname}</td>
                <td>${currentStudentClass[0].midterm}</td>
                <td>${currentStudentClass[0].final}</td>
                <td>${currentStudentClass[0].letterNode}</td>
                <td><button onclick="updateStudent(${currentStudent.no},${classId})">Update</button></td>
                <td><button onclick="deleteStudent(${currentStudent.no})">Delete</button></td>
            
            
             </tr`
             table.innerHTML +=row; 
            }
            //
        }
    }
    else{
        
        return;
    }
}
function getCoursesIndex(studentId,classId){ // bring the course index
    let i=getStudentIndex(studentId);
    for(let y=0;students[i].takingClasses.length;y++){
        if(students[i].takingClasses[y].classId == classId){
            return y;
        }
    }
    return null;
}
var upClassName=""
var studId=""
function updateStudent(studentId,classId){ // brings the updatestudent menu
    let getstud=getStudent(studentId);
    let i = getStudentIndex(studentId);
    let y= getCoursesIndex(studentId,classId);
    let doc=document.querySelector(".update-student")
    doc.style.display="flex";
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    let name=document.getElementById("update-student-name");
    let surname=document.getElementById("update-student-surname");
    let midterm=document.getElementById("update-midterm");
    let final=document.getElementById("update-final");
    let currentStudent=students[i].takingClasses[y];
    name.value=getstud.name;
    surname.value=getstud.surname;
    midterm.value=currentStudent.midterm;
    final.value=currentStudent.final
    let tableParent=document.querySelector(".table-class");
    tableParent.style.display="none"
    studId=studentId;
    
    
}
function afterUpdateStudent(){ // updates the student when button is clicked
    console.log("studentId",studId)
    console.log("classname",upClassName)
    let name=document.getElementById("update-student-name");
    let surname=document.getElementById("update-student-surname");
    let midterm=document.getElementById("update-midterm");
    let final=document.getElementById("update-final");
    let i = getStudentIndex(studId);
    let y= getCoursesIndex(studId,getClassId(upClassName));
    students[i].name=name.value;
    students[i].surname=surname.value;
    if(midterm.value <0 || midterm.value >100 || final.value<0 || final.value>100){
        addAlert("Values cannnot be smaller than zero")
        body.style.backgroundColor="rgba(0,0,0,0.5)"
        if(midterm.value<0 || midterm.value >100){
            midterm.value=""
            body.style.backgroundColor="rgba(0,0,0,0.5)"
        }
        if(final.value<0 || final.value>100){
            final.value=""
            body.style.backgroundColor="rgba(0,0,0,0.5)"
        }
    }
    else{
        students[i].takingClasses[y].midterm=midterm.value;
        students[i].takingClasses[y].final=final.value;
        students[i].takingClasses[y].letterNode=calculateStudentGrade(getClassIndex(upClassName),midterm.value,final.value);
        let doc=document.querySelector(".update-student")
        addSuccess("Student successfully updated!")
        doc.style.display="none";
        body.style.backgroundColor="rgba(0,0,0,0)"
        getClassTable(upClassName)
    }
}
function deleteStudent(studentId){ // deletes student by entered id
    let index= getClassIndex(upClassName);
    let newClass=classes[index].student.filter((e)=>e != studentId);
    classes[index].student=newClass;
    let couserIndex= getCoursesIndex(studentId,getClassId(upClassName));
    let studentIndex= getStudentIndex(studentId);
    let newtaking =students[studentIndex].takingClasses.filter((e)=> e.classId != getClassId(upClassName))
    students[studentIndex].takingClasses=newtaking;
    console.log("after deletstudent studutnd",students);
    console.log("after deletstudent class",classes);
    addSuccess("Student successfully deleted!")
    getClassTable(upClassName);
}
function searchStudent(){ // brings the search student menu 
    
    body.style.backgroundColor="rgba(0,0,0,0.5)"
    if(classes.length==0){
        addAlert("You have not added any classes yet!")
        return
    }
    if(students.length==0){
        addAlert("You have not added any student yet!")
        return
    }
    else{
        let doc = document.querySelector(".search-student")
        doc.style.display="flex";
    }
}
function getClassName(classId){
    for(let i=0;i<classes.length;i++){
        if(classes[i].id==classId){
            return classes[i].name;
        }
        
    }
}
function bringStudent(){  //check the input of student table menu
    let doc = document.querySelector(".search-student")
    let studentId = document.getElementById("get-student-name").value;
    let newArray= students.filter((e)=>e.no ==studentId)
    console.log("bringstudent",newArray)
    if(newArray.length==0 ){ // if no student is matched
        addAlert("No such student found")
        doc.style.display="none";
        return
    }
    else{
        let tableParent=document.querySelector(".table-class");
        tableParent.style.display="none"
        searchClassVal=""
        getStudentTable(studentId);
        doc.style.display="none";
        body.style.backgroundColor="rgba(0,0,0,0)"
        return
    }

}
function getStudentTable(studentId){ // returns student table
    let studentIndex= getStudentIndex(studentId);
    let doc =document.querySelector(".student-class");
    let name = document.querySelector("#student-bring-name")
    let tbody= document.querySelector("#tbody-student")
    tbody.innerHTML=""
    name.textContent=(students[studentIndex].no +" "+students[studentIndex].name+" "+students[studentIndex].surname)
    doc.style.display="flex";
    searchStudentVal="flex"
    searchStudentId=studentId;
    for(let i =0 ; i<students[studentIndex].takingClasses.length ;i++){
        let currentStudent=students[studentIndex].takingClasses[i];
        var row=`
            <tr> 
            <td>${getClassName(currentStudent.classId)}</td>
            <td>${currentStudent.midterm}</td>
            <td>${currentStudent.final}</td>
            <td>${currentStudent.letterNode}</td>
            </tr`
        tbody.innerHTML +=row    
    }
    // calculating gpa
    let rows=`
    <tr> 
    <td>GPA</td>
    <td>${calculateGPA(studentId)}</td> 
    </tr`
    tbody.innerHTML +=rows 

}
function addSuccess(texts){ // brings succes message
    console.log(texts)
    let alerting=document.querySelector(".success");
    alerting.style.display="flex"
    let txt= document.querySelector(".alert-messages")
    txt.textContent=texts
    setTimeout(()=>{
        removeSuccess()
    },2000)
}
function  removeSuccess(){ //removes success message
    let alerting=document.querySelector(".success");
    alerting.style.display="none"
    body.style.backgroundColor="rgba(0,0,0,0)"
    
}
function calculateGPA(studentId){ // calculates gpa
    let index = getStudentIndex(studentId)
    console.log("index",index)
    let gpa=0;
    for (let x = 0; x < students[index].takingClasses.length; x++) {
        let current=students[index].takingClasses[x].letterNode;
        
        console.log("harf",current)
        if(current=="A"){
            gpa=gpa+4
        }
        if(current=="B"){
            gpa=gpa+3
        }
        if(current=="C"){
            gpa=gpa+2
        }
        if(current=="D"){
            gpa=gpa+1
        }
        if(current=="F"){
            gpa=gpa+0
        }
        
        
    }
    gpa=gpa/students[index].takingClasses.length;
    return gpa;
}
