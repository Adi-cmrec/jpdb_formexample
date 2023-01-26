var baseUrl = "http://api.login2explore.com:5577";
function setBaseUrl(baseUrlArg) {
    baseUrl = baseUrlArg;
}

var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var empDBName ="EMP_DB";
var empRelName="EMPDate";
var connToken="90932317|-31949271327810288|90954188"

$('#empId').focus();

function saveRecNo2Ls(jsonObj){
    var lvData= JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}

function getEmpidAsJsonObj(){
    var empid = $('#empId').val();
    
    var jsonStr = {
        id: empId
    };
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj){
    saveRecNo2Ls(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#empName').val(record.name);
    $("#empbs").val(record.salary);
    $("#emphra").val(record.hra);
    $("#empda").val(record.da);
    $("#deduct").val(record.deduction);
}

function resetForm() {
    $("#empId").val("")
    $("#empName").val("");
    $("#empbs").val("");
    $("#emphra").val("");
    $("#empda").val("");
    $("#deduct").val("");
    $('#empId').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $("#empId").focus();
}

function validateData(){
    var empid,empname,empsal,hra,da,deduct;
    empid= $('#empId').val();
    empname=$('empName').val();
    empsal=$("#empbs").val("");
    hra=$("#emphra").val("");
    da=$("#empda").val("");
    deduct=$("#deduct").val("");

    if(empid===''){
        alert('employee id missing');
        $('#empid').focus();
        return "";

    }
    if(empname===''){
        alert('employee name missing');
        $('#empname').focus();
        return "";
        
    }
    if(empsal===''){
        alert('employee salary missing');
        $('#empsal').focus();
        return "";
        
    }
    if(hra===''){
        alert('employee hra missing');
        $('#hra').focus();
        return "";
        
    }
    if(da===''){
        alert('employee da missing');
        $('#da').focus();
        return "";
        
    }
    if(deduct===''){
        alert('employee deduct missing');
        $('#deduct').focus();
        return "";
        
    }

    var jsonStrObj={
        id: empid,name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction : deduct
    };
    return JSON.stringify(jsonStrObj);

}

function getEmp(){
    var empIdJsonObj = getEmpidAsJsonObj();
    var getRequest=createGET_BY_KEYRequest(connToken,empDBName,empRelName,empIdJsonObj);
    jQuery.ajaxSetup({async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdpBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status===400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#empName').focus();
    }
    else if(resJsonObj.status===200){
        $('#empId').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#empName').focus();
    }
}

function saveData(){
    var jsonStrObj= validateData();
    if(jsonStrObj===''){
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,empDBName,empRelName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdpBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#empId').focus();
}

function changeData(){
    $('#change').prop("disabled",true);

    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async : false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdpBaseURL,jpdbIML);
    jQuery.ajaxSetup({ async: true});

    console.log(resJsonObj);
    resetForm();
    $('#empId').focus();

}


