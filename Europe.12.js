const DEVICE = require('device.js');
const robot = require('robot.js');
DEVICE.checkPermission();
DEVICE.setEventListener();

const pointMap = {
    contuneBtn: [2190, 1000], // 继续按钮/开始/选车 通用
    firstOil: [570, 640], //第一个油
    carDistance: [509, 346], //车辆距离 x,y
    carNum: 0, //从第几辆车开始
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
        console.setSize(400, 500)
        sleep(1000);
    }

}



//选择赛事
function chooseEvent() {
    let swipeNum = 0;
    while (swipeNum < 10) {
        swipeNum++;
        robot.swipe(1500, 300, 1500, 900, 300)
    }
    sleep(1000)
    robot.swipe(1500, 1000, 1500, 300, 300);
    sleep(1000)
    click(822, 783); ////选12关
    sleep(1000)
    robot.click(pointMap.contuneBtn); //点击开始
    sleep(2000)
    log('选择赛事成功')
}


let carNum = pointMap.carNum;

function chooseCar() {
    // 
    let carDistance = pointMap.carDistance;
    let firstOil = pointMap.firstOil; //第一个油
    let oilColor = ["#ffc3fb12", "#ffb9fa21", "#ffbafa20"];
    let initCarState = false;

    while (!initCarState) {
        if (carNum > 7) {
            robot.swipe(1000, 500, 2000, 500, 300);
            sleep(2000);
            carNum = 0
        }
        let x = firstOil[0] + carDistance[0] * (carNum % 4),
            y = firstOil[1] + carDistance[1] * Math.floor(carNum / 4);
        // console.log(x, y);
        if (utils.isColor([x, y], oilColor)) {
            initCarState = true;
            robot.click(x, y);
            log('选择车辆：' + Number(carNum + 1))
        } else { //没有油
            carNum++;
        }
    }
    sleep(2000);
    robot.click(pointMap.contuneBtn); //点击开始


}
//自动跑
function autoRun() {
    sleep(10000);
    log("比赛开始")
    for (let i = 0; i < 6; i++) {
        sleep(9400)
        robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
        sleep(600)
        robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
    }
    count++;
    log("完成比赛:" + count + "次");
    //一分钟跑完之后
    let isDone = false;

    while (!isDone) {
        sleep(1000)
        let isComment = utils.isColor([1750, 860], ["#ffc3fc0f"])
        if (isComment) { //推荐性能分
            chooseEvent();
            chooseCar();
            autoRun();
            isDone = true;
        } else {
            robot.click(pointMap.contuneBtn); //点击开始/继续/氮气加速
        }
    }


}
utils.initConsole();
let count = 0; // 完成数量
chooseEvent();
chooseCar();
autoRun();
exit();