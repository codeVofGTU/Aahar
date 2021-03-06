var a=angular.module("menulist",[]);

a.controller("menulistctrl",function($scope,$http){
    $scope.classlist=[];//餐饮类型信息
    $scope.cateringlist=[];//餐饮信息
    $scope.ccseq = "";
    $scope.currentPage = 1; // 当前页 （请求数据）
    $scope.pageSize = 8; // 每页记录数 （请求数据）
    $scope.totalCount = 0; // 总记录数 （响应数据）
    $scope.totalPages = 0; // 总页数 （根据 总记录数、每页记录数 计算 ）

    
    var config = {
    	headers:{'Content-Type':'application/json'}
    };
    //初始化页面
    $scope.init1=function(){
    	var f=$http.post("http://127.0.0.1:8080/Classifications").success(function (data) {
                    console.log(data);
               });
        f.success(function(data){
            $scope.classlist=data;
        });
        
    };
    $scope.init1();
    
    //添加购物车
 	$scope.gotocart=function(cseq){
     	//  	var useq = window.localStorage.getItem("");
		var useq =1;
    	var date = {
    		"ciseq":cseq,
    		"num":1,
    		"useq":useq
    	}
     	var f=$http.post("http://127.0.0.1:8080/Cart",date).success(function (data) {
            console.log(data);
        });
        f.success(function(data){
            window.location.href="mall-cart.html";//跳转
        });
    }
    
    //切换餐饮类型
    $scope.checkout=function(cseq){
    	$scope.ccseq = ccseq;
    	$scope.selectPage(1);
    }
    
    //加载上一页
    $scope.prev = function() {
        $scope.selectPage($scope.currentPage - 1);
    }
    //加载下一页
    $scope.next = function() {
        $scope.selectPage($scope.currentPage + 1);
    }
	//加载指定页
    $scope.selectPage = function(page) {
        // page 超出范围
        if($scope.totalPages != 0 && (page < 1 || page > $scope.totalPages)) {
            return;
        }
        var date = {
    		"entity":{
    			"ccseq":$scope.ccseq
    		},
    		"page":$scope.page,
			"size":$scope.pageSize
    	}
        //发送请求
       var f=$http.post("http://127.0.0.1:8080/Cateringinfos/page",date).success(function (data) {
            console.log(data);
        });
       f.success(function(data, status, headers, config) {
            // 要在分页工具条显示所有页码 
            $scope.pageList = new Array();
            // 显示表格数据 
            $scope.cateringlist = data.records;
            //先根据总记录数去计算总页数
            $scope.totalCount = data.total; //总记录数
            $scope.totalPages = data.pages; //总页数
            // 更新当前显示页码 
            $scope.currentPage = page;
            //显示分页工具条中间码
            var begin; // 显示第一个页码
            var end; // 显示最后一个页码 
            // 如果每页显示10页,理论上 begin 是当前页 -5 
            begin = $scope.currentPage - 5;
            if(begin < 1) { //begin不能小于1
                begin = 1;
            }
            // 显示10个页码，理论上end 是 begin + 9
            end = begin + 9;
            if(end > $scope.totalPages) {
                //最后一页不能大于总页数
                end = $scope.totalPages;
            }
            // 修正begin 的值, 理论上 begin 是 end - 9
            begin = end - 9;
            if(begin < 1) { //begin不能小于1
                begin = 1;
            }
            // 将页码加入 PageList集合
            for(var i = begin; i <= end; i++) {
                $scope.pageList.push(i);
            }
        })
       	f.error(function(data, status, headers, config) {
            // 当响应以错误状态返回时调用
            alert("出错，请联系管理员 ");
        });
    }
    //判断是否是当前页
    $scope.isActivePage = function(page) {
        return page === $scope.currentPage;
    }
    // 初始化，选中第一页
    $scope.selectPage(1);
    
    
});