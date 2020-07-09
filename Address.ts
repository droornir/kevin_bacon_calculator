module.exports = class Address {
    street: string;
    city: string;
    constructor(_street: string, _city: string) {
        this.street = _street;
        this.city = _city;
    }

    isRelated = (anotherAddr: Address): boolean => {
        return (this.street === anotherAddr.street && this.city === anotherAddr.city);
    };

}