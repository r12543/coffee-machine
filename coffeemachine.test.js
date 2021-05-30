const CoffeeMachine = require("./coffeemachine");
const fixtures = require("./fixtures");

test("Should instantiate the CoffeeMachine", () => {
    const coffeeMachine = new CoffeeMachine(2, {}, {});
    expect(typeof coffeeMachine).toBe("object");
    expect(typeof coffeeMachine.prepare).toBe("function");
    expect(typeof coffeeMachine.refill).toBe("function");
    expect(coffeeMachine.outlets).toStrictEqual(2);
    expect(coffeeMachine.beverages).toStrictEqual({});
    expect(coffeeMachine.ingredientsMaxQuantity).toStrictEqual({});
    expect(coffeeMachine.ingredientsCurrQuantity).toStrictEqual({});
});

test("Should prepare one beverage", async () => {
    const machine = fixtures.machine1;
    const coffeeMachine = new CoffeeMachine(
        machine.outlets.count_n,
        machine.beverages,
        machine.total_items_quantity
    );
    const beverage = "hot_tea";
    await coffeeMachine.prepare(beverage, (result) => {
        expect(result).toBe(`${beverage} is prepared`);
    });
    expect(coffeeMachine.ingredientsCurrQuantity.hot_water).toBe(300);
    expect(coffeeMachine.ingredientsCurrQuantity.hot_milk).toBe(400);
    expect(coffeeMachine.ingredientsCurrQuantity.ginger_syrup).toBe(90);
    expect(coffeeMachine.ingredientsCurrQuantity.sugar_syrup).toBe(90);
    expect(coffeeMachine.ingredientsCurrQuantity.tea_leaves_syrup).toBe(70);
});

test("Should not prepare invalid beverage", async () => {
    const machine = fixtures.machine1;
    const coffeeMachine = new CoffeeMachine(
        machine.outlets.count_n,
        machine.beverages,
        machine.total_items_quantity
    );
    const beverage = "invalid_beverage";
    await coffeeMachine.prepare(beverage, (result) => {
        expect(result).toBe(`Coffee Machine does not support ${beverage}`);
    });
});

test("Should prepare two beverages", async () => {
    const machine = fixtures.machine1;
    const coffeeMachine = new CoffeeMachine(
        machine.outlets.count_n,
        machine.beverages,
        machine.total_items_quantity
    );
    const prepareHotTea = new Promise((resolve, reject) => {
        coffeeMachine.prepare("hot_tea", (result) => {
            resolve(result);
        });
    });
    const prepareHotCoffee = new Promise((resolve, reject) => {
        coffeeMachine.prepare("hot_coffee", (result) => {
            resolve(result);
        });
    });
    const promises = [prepareHotTea, prepareHotCoffee];
    await Promise.all(promises).then((values) => {
        expect(values[0]).toBe(`hot_tea is prepared`);
        expect(values[1]).toBe(`hot_coffee is prepared`);
    });
    expect(coffeeMachine.ingredientsCurrQuantity.hot_water).toBe(200);
    expect(coffeeMachine.ingredientsCurrQuantity.hot_milk).toBe(0);
    expect(coffeeMachine.ingredientsCurrQuantity.ginger_syrup).toBe(60);
    expect(coffeeMachine.ingredientsCurrQuantity.sugar_syrup).toBe(40);
    expect(coffeeMachine.ingredientsCurrQuantity.tea_leaves_syrup).toBe(40);
});

test("Should prepare two beverages but not the other two", async () => {
    const machine = fixtures.machine1;
    const coffeeMachine = new CoffeeMachine(
        machine.outlets.count_n,
        machine.beverages,
        machine.total_items_quantity
    );
    const prepareHotTea = new Promise((resolve, reject) => {
        coffeeMachine.prepare("hot_tea", (result) => {
            resolve(result);
        });
    });
    const prepareHotCoffee = new Promise((resolve, reject) => {
        coffeeMachine.prepare("hot_coffee", (result) => {
            resolve(result);
        });
    });
    const prepareGreenTea = new Promise((resolve, reject) => {
        coffeeMachine.prepare("green_tea", (result) => {
            resolve(result);
        });
    });
    const prepareBlackTea = new Promise((resolve, reject) => {
        coffeeMachine.prepare("black_tea", (result) => {
            resolve(result);
        });
    });
    const promises = [
        prepareHotTea,
        prepareHotCoffee,
        prepareGreenTea,
        prepareBlackTea,
    ];
    await Promise.all(promises).then((values) => {
        expect(values[0]).toBe(`hot_tea is prepared`);
        expect(values[1]).toBe(`hot_coffee is prepared`);
        expect(values[2]).toBe(
            `green_tea can not be prepared because green_mixture is not available`
        );
        expect(values[3]).toBe(
            `black_tea can not be prepared because hot_water is not sufficient`
        );
    });
    expect(coffeeMachine.ingredientsCurrQuantity.hot_water).toBe(100);
    expect(coffeeMachine.ingredientsCurrQuantity.hot_milk).toBe(0);
    expect(coffeeMachine.ingredientsCurrQuantity.ginger_syrup).toBe(30);
    expect(coffeeMachine.ingredientsCurrQuantity.sugar_syrup).toBe(40);
    expect(coffeeMachine.ingredientsCurrQuantity.tea_leaves_syrup).toBe(40);
});

test("Should refill the ingredients", async () => {
    const machine = fixtures.machine1;
    const coffeeMachine = new CoffeeMachine(
        machine.outlets.count_n,
        machine.beverages,
        machine.total_items_quantity
    );
    const beverage = "hot_tea";
    await coffeeMachine.prepare(beverage, (result) => {
        expect(result).toBe(`${beverage} is prepared`);
    });
    coffeeMachine.refill("hot_water", 100);
    expect(coffeeMachine.ingredientsCurrQuantity.hot_water).toBe(400);
    coffeeMachine.refill("hot_milk", 300); // giving more than the limit
    expect(coffeeMachine.ingredientsCurrQuantity.hot_milk).toBe(500);
    coffeeMachine.refill("ginger_syrup", 100); // giving more than the limit
    expect(coffeeMachine.ingredientsCurrQuantity.ginger_syrup).toBe(100);
    coffeeMachine.refill("sugar_syrup", 3);
    expect(coffeeMachine.ingredientsCurrQuantity.sugar_syrup).toBe(93);
    coffeeMachine.refill("tea_leaves_syrup", 20);
    expect(coffeeMachine.ingredientsCurrQuantity.tea_leaves_syrup).toBe(90);
});
