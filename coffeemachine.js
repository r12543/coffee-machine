class CoffeeMachine {
    constructor(outlets, beverages, ingredientsMaxQuantity) {
        this.outlets = outlets;
        // This contains the beverage info about ingredients
        this.beverages = beverages;
        // The Ingredients maximum quantity that machine supports, this
        // helps in refilling the ingredients
        this.ingredientsMaxQuantity = ingredientsMaxQuantity;
        // The Ingredients current quantity present in the machine
        this.ingredientsCurrQuantity = JSON.parse(
            JSON.stringify(ingredientsMaxQuantity)
        );
        // Number of outlets which are preparing beverages
        this.busyOutlets = 0;
    }
    /**
     * Async function to prepare the beverages
     *
     * @param {*} beverage Which supported beverage machine should prepare
     * @param {*} callback Callback function to return the correct output
     * @returns
     */
    async prepare(beverage, callback) {
        if (this.busyOutlets === this.outlets) {
            callback(
                `All outlets are preparing beverages. Try after sometime.`
            );
            return;
        }
        this.busyOutlets += 1;

        const beverageIngredients = this.beverages[beverage];
        if (!beverageIngredients) {
            callback(`Coffee Machine does not support ${beverage}`);
            return;
        }
        for (let ingredient in beverageIngredients) {
            const requiredQty = beverageIngredients[ingredient];
            const availableQty = this.ingredientsCurrQuantity[ingredient];

            if (!availableQty && availableQty != 0) {
                callback(
                    `${beverage} can not be prepared because ${ingredient} is not available`
                );
                return;
            } else if (requiredQty > availableQty) {
                callback(
                    `${beverage} can not be prepared because ${ingredient} is not sufficient`
                );
                return;
            }
            this.ingredientsCurrQuantity[ingredient] =
                availableQty - requiredQty;
        }
        this.busyOutlets -= 1;
        callback(`${beverage} is prepared`);
        return;
    }
    /**
     * This refills a particular ingredient and keep check on the max
     * quantity the machine supports of the provided ingredient
     * @param {*} ingredient Ingredient to be refilled
     * @param {*} quantity The quantity of ingredient
     */
    refill(ingredient, quantity) {
        const currQuantity = this.ingredientsCurrQuantity[ingredient];
        let newQuantity = currQuantity + quantity;
        // taking only the required amounts
        if (newQuantity > this.ingredientsMaxQuantity[ingredient]) {
            newQuantity = this.ingredientsMaxQuantity[ingredient];
        }
        this.ingredientsCurrQuantity[ingredient] = newQuantity;
    }
}

module.exports = CoffeeMachine;
