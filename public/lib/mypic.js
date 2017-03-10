Highcharts.setOptions({
        global:{
            useUTC:false
        }
    });
    function compare(arr1,arr2){
        return arr1[0]-arr2[0];
    }
    function baospeed(array){
         var newarr=array;
         for(var i=1;i<array.length;i++){
             var times=(array[i][0]-array[i-1][0])/1000;//时间差,秒
             var Bytes=array[i][1];
             newarr[i][1]=parseInt(Bytes/times*1000)/1000;//速率，保留三位有效数字
         }
         newarr.shift();//去掉第一个
         return newarr;
        }
    function arrayCon(arrBefore){
        var newarr=[];
        for(var i=1;i<arrBefore.length;i++){
            newarr=newarr.concat(arrBefore[i]);
        }
        return newarr.sort(compare);
    }
    function arrayYasuo(arrBefore){
        var newarr=[];
        for(var i=0;i<arrBefore.length;){
            var step=arrBefore.length-i>120?120:arrBefore.length-i;
            var sum=0;
            for(j=0;j<step;j++){
                sum+=arrBefore[j+i][1];
            }
            newarr.push([arrBefore[i][0],sum]);
            i+=120;
        }
        return newarr;
    }
function renderA(protocolArr){
    var lines={};
        //一条线路是一个网卡，有四个端口
    for(var i=0;i<protocolArr.length;i++){
        lines[protocolArr[i][0]]=baospeed(arrayYasuo(arrayCon(protocolArr[i])));
        // console.log(lines);
    }
    //线路
    $('#pic_lines').highcharts('StockChart', {
        rangeSelector : {
            enabled:false
        },
        title : {
            text : '线路总流量',
            verticalAlign:'bottom'
        },
        legend: {
            enabled: true                                             
        },
        yAxis: {  
            title: {   
                text: 'pps'                          
            },       
            tickInterval:100                  
        },
        credits:{
            enabled:false
        },
        series:setBSeries(lines)
    });
}
function setBSeries(lines){
    var arr=[];
    for(var line in lines){
        var obj={};
        obj.name="线路"+line;
        obj.data=lines[line];
        arr.push(obj);
    }
    arr.sort(function(obj1,obj2){
        return obj1-obj2;
    })
    return arr;
}
