const DEVICE = require('device.js');
const robot = require('robot.js');
DEVICE.checkPermission();
DEVICE.setEventListener();
const pointMap = {

    init: [1650, 730], //判断是否初始化，
    homeRouter: [2100, 1000], //首页入口  例：进入生涯


    contuneBtn: [1900, 950], // 继续按钮/开始/选车 通用
    shopBtn: [650, 50], //商店按钮坐标
    carDistance: [511, 360], //车辆距离 x,y
    carNum: 0
}

const utils = {
    // 获取颜色
    isColor(point, compareColor) {
        let img = captureScreen();
        let color = images.pixel(img, point[0], point[1]);
        // console.log(colors.toString(color));
        if (typeof compareColor === "string") {
            return colors.equals(colors.toString(color), compareColor)

        } else {
            let bool = false;
            compareColor.map((item, i) => {
                if (colors.equals(colors.toString(color), item)) {
                    bool = true;
                }
            })
            return bool
        }
    },
    // 初始化console，方便查看错误信息
    initConsole() {
        console.show();
        sleep(1000);
        console.setSize(500, 1000)
            // console.setPosition(1000, 0)
        sleep(1000);
    },
    //初始化App
    initApp() {
        toast("正在打开app")
        if (!launchApp("狂野飙车9")) {
            toast("找不到App");
            exit();
        }

        sleep(5000); // 等待5s APP启动

        let init = false;
        while (!init) {
            robot.back();
            sleep(2000);
            init = utils.isColor(pointMap.init, "#ffffff");
        }
        if (init) {
            robot.back();
            toast("初始化完成")
        }
        sleep(1000);

    }
}



//选择赛事
function chooseEvent() {
    robot.click(2074, 920);
    sleep(2000)
    robot.click(2074, 920); //点击开始
    sleep(2000)
    log('选择赛事')
}


let carNum = pointMap.carNum;

function chooseCar() {
    // 
    let carDistance = pointMap.carDistance;
    let firstOil = [542, 625]; //第一个油
    let oilColor = ["#ffc3fb12", "#ffb9fa21", "#ffbafa20"];
    let initCarState = false;

    while (!initCarState) {
        if (carNum > 2) {
            initCarState = true
            exit();
        }
        let x = firstOil[0] + carDistance[0] * (carNum % 2),
            y = firstOil[1] + carDistance[1] * Math.floor(carNum / 2);
        if (utils.isColor([x, y], oilColor)) {
            initCarState = true;
            log("ok");
            carNum = 0;
            robot.click(x, y);
        } else { //没有油
            carNum++;
        }
    }
    sleep(2000);
    robot.click(2120, 960); //点击开始
    log("点击开始")
}
//自动跑
function autoRun() {
    sleep(10000);
    log("比赛开始")
    for (let i = 0; i < 10; i++) {
        sleep(4400)
        robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
        sleep(600)
        robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
    }
    count++
    log("第" + count + "次完成比赛")
        //一分钟跑完之后
    let isDone = false;

    while (!isDone) {

        let isFinished = utils.isColor([1368, 256], ["#ff1a1e69"])
        if (isFinished) {
            chooseEvent();
            chooseCar();
            autoRun();
            isDone = true;
        } else {
            robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速   
            sleep(300)
            robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
            sleep(2000);
        }
    }


}
utils.initConsole();

chooseEvent();
let count = 0; // 完成数量
chooseCar();
autoRun();
exit();