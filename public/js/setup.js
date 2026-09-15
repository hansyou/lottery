/**
 * 设置面板模块
 * 处理奖项添加、删除和开始抽奖逻辑
 */
const LotterySetup = {
    prizeCounter: 0,

    /**
     * 初始化设置面板
     */
    async init() {
        this.bindEvents();
        this.addDefaultPrizes();
        await this.loadNamelist();
    },

    /**
     * 加载 namelist.txt 预设名单
     */
    async loadNamelist() {
        try {
            const resp = await fetch("/api/namelist");
            const data = await resp.json();
            if (data.exists && data.names.length > 0) {
                const participantsInput = LotteryUtils.$("participants");
                if (participantsInput && !participantsInput.value.trim()) {
                    participantsInput.value = data.names.join("\n");
                }
            }
        } catch (e) {
            console.warn("无法读取 namelist.txt:", e);
        }
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        const addPrizeBtn = LotteryUtils.$("addPrizeBtn");
        const startBtn = LotteryUtils.$("startBtn");

        if (addPrizeBtn) {
            addPrizeBtn.addEventListener("click", () => this.addPrizeItem());
        }

        if (startBtn) {
            startBtn.addEventListener("click", () => this.startLottery());
        }
    },

    /**
     * 添加默认奖项
     */
    addDefaultPrizes() {
        this.addPrizeItem("三等奖", 11);
        this.addPrizeItem("二等奖", 6);
        this.addPrizeItem("一等奖", 3);
    },

    /**
     * 添加奖项项
     * @param {string} name - 奖项名称
     * @param {number} quantity - 奖项数量
     */
    addPrizeItem(name = "", quantity = 1) {
        this.prizeCounter++;
        const prizeList = LotteryUtils.$("prizeList");

        const prizeItem = document.createElement("div");
        prizeItem.className = "prize-item";
        prizeItem.innerHTML = `
            <input type="text" class="prize-name" placeholder="奖项名称" value="${name}">
            <input type="number" class="prize-quantity" placeholder="数量" value="${quantity}" min="1">
            <button class="remove-prize" onclick="LotterySetup.removePrizeItem(this)">×</button>
        `;

        prizeList.appendChild(prizeItem);
    },

    /**
     * 删除奖项项
     * @param {HTMLElement} button - 删除按钮
     */
    removePrizeItem(button) {
        const prizeItems = LotteryUtils.$$(".prize-item");
        if (prizeItems.length <= 1) {
            alert("至少需要保留一个奖项！");
            return;
        }
        button.parentElement.remove();
    },

    /**
     * 开始抽奖
     */
    startLottery() {
        // 获取标题
        const titleInput = LotteryUtils.$("title");
        LotteryState.title = titleInput.value.trim() || "婚礼抽奖";

        // 获取参与者
        const participantsInput = LotteryUtils.$("participants");
        const participantsText = participantsInput.value.trim();

        if (!participantsText) {
            alert("请输入参与人员名单！");
            return;
        }

        LotteryState.participants = participantsText
            .split(/[\n,]/)
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (LotteryState.participants.length === 0) {
            alert("参与人员名单不能为空！");
            return;
        }

        // 获取奖项设置
        const prizeItems = LotteryUtils.$$(".prize-item");
        LotteryState.prizes = [];
        let totalQuantity = 0;

        for (const item of prizeItems) {
            const name = item.querySelector(".prize-name").value.trim();
            const quantity =
                parseInt(item.querySelector(".prize-quantity").value) || 0;

            if (!name) {
                alert("请填写所有奖项名称！");
                return;
            }

            if (quantity <= 0) {
                alert("奖项数量必须大于0！");
                return;
            }

            LotteryState.prizes.push({ name, quantity, winners: [] });
            totalQuantity += quantity;
        }

        if (totalQuantity > LotteryState.participants.length) {
            alert(
                `抽奖总数量（${totalQuantity}）不能超过参与人数（${LotteryState.participants.length}）！`,
            );
            return;
        }

        // 初始化抽奖状态
        LotteryState.currentPrizeIndex = 0;
        LotteryState.allResults = [];

        // 切换面板
        LotteryMain.switchPanel("lottery");
    },

    /**
     * 重置设置面板
     */
    reset() {
        const titleInput = LotteryUtils.$("title");
        const participantsInput = LotteryUtils.$("participants");
        const prizeList = LotteryUtils.$("prizeList");

        if (titleInput) titleInput.value = "婚礼抽奖";
        if (participantsInput) participantsInput.value = "";
        if (prizeList) prizeList.innerHTML = "";

        this.prizeCounter = 0;
        this.addDefaultPrizes();
    },
};
