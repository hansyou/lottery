/**
 * 主入口模块
 * 初始化所有模块，管理面板切换
 */
const LotteryMain = {
    currentPanel: "setup",

    /**
     * 初始化应用
     */
    async init() {
        // 加载 HTML 片段
        await this.loadPanels();

        // 初始化各模块
        await LotterySetup.init();
        LotteryRoller.init();
        LotteryResult.init();

        // 初始显示设置面板
        this.switchPanel("setup");
    },

    /**
     * 加载所有面板 HTML
     */
    async loadPanels() {
        const container = LotteryUtils.$("container");

        // 并行加载所有 HTML 片段
        const [setupHTML, lotteryHTML, resultHTML] = await Promise.all([
            LotteryUtils.loadHTML("html/setup.html"),
            LotteryUtils.loadHTML("html/lottery.html"),
            LotteryUtils.loadHTML("html/result.html"),
        ]);

        // 插入到容器
        if (container) {
            container.innerHTML = setupHTML + lotteryHTML + resultHTML;
        }
    },

    /**
     * 切换面板
     * @param {string} panel - 面板名称: 'setup', 'lottery', 'result'
     */
    switchPanel(panel) {
        const setupPanel = LotteryUtils.$("setupPanel");
        const lotteryPanel = LotteryUtils.$("lotteryPanel");
        const resultPanel = LotteryUtils.$("resultPanel");

        // 隐藏所有面板
        LotteryUtils.hide(setupPanel);
        LotteryUtils.hide(lotteryPanel);
        LotteryUtils.hide(resultPanel);

        // 显示目标面板
        switch (panel) {
            case "setup":
                LotteryUtils.show(setupPanel);
                break;
            case "lottery":
                LotteryRoller.loadCurrentPrize();
                LotteryUtils.show(lotteryPanel);
                break;
            case "result":
                LotteryResult.showResults();
                LotteryUtils.show(resultPanel);
                break;
        }

        this.currentPanel = panel;

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
};

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
    LotteryMain.init();
});
