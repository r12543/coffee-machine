## Coffee Machine

coffeemachine.js provides CoffeeMachine class which has methods like prepare and refill. It supports parallel preparation of beverages from multiple outlets at one time.

### Assumptions

-   The `prepare` method call will go sequentially, though the preparation will start a/c to the availability of outlets. For ex: if we call prepare(hot_tea), prepare(hot_coffee), prepare(green_tea), then machine will start the preparation in that order only
-   The machine takes the beverages with ingredients as their property as I assumed that machine should have the knowledge of the proportions of ingredient for the beverages and it should know what beverage it supports
-   If beverage does not get prepared, then the order of ingredients will determine the 'not available/not sufficient' part of the return string. For ex, if we do prepare(green_tea) and ingredients are in order hot_water, ginger_syrup, green_mixture, sugar_syrup, then the output might be 'can not be prepared as green_mixture is not available' but if the order is hot_water, ginger_syrup, sugar_syrup, green_mixture, then the output might be 'can not be prepared as sugar_syrup is not sufficient'
-   The `refill` method will add the quantity on top of the already present quantity

### Test

-   Node version: `v14.x.x`
-   Set up: `npm install`
-   Run tests: `npm test`

### To add more test fixtures

-   Go to fixtures.js, add machine2/3/4, and add the contents in the mentioned format only. And add more tests accordingly.
