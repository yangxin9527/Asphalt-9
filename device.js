auto();
const targetBrightness = 0;
const targetMediaVolume = 0;
const autoBrightnessMode = 1;
const isAutoBrightnessMode = device.getBrightnessMode();
const previousBrightness = device.getBrightness();
const previousMusicVolume = device.getMusicVolume();

module.exports = {
    /**
     * 监听“音量下”键
     */
    setEventListener: () => {
        // 手动退出
        threads.start(function() {
            // 启用按键监听
            events.observeKey();
            events.on("exit", function() {
                log("结束运行");
                console.hide();
                revertPower();
                threads.shutDownAll();
            });
            // 监听音量下键按下
            events.onKeyDown("volume_down", function(event) {
                log("程序即将退出");
                revertPower();
                threads.shutDownAll();
                toastLog("程序手动退出");
                exit();
            });
        });
    },

    /**
     * 检查无障碍和截图权限
     */
    checkPermission: () => {
        auto();
        if (!requestScreenCapture(true)) {
            toastLog('请求截图失败，程序结束');
            exit();
        }
        savePower();
    },

    /**
     * 调节亮度及音量，进入低功耗模式
     */

}
savePower = () => {
    device.setBrightness(targetBrightness);
    device.setMusicVolume(targetMediaVolume);
}

/**
 * 还原运行时脚本之前的屏幕亮度及设备音量
 */
revertPower = () => {
    isAutoBrightnessMode ? device.setBrightnessMode(autoBrightnessMode) : device.setBrightness(previousBrightness);
    device.setMusicVolume(previousMusicVolume);
}