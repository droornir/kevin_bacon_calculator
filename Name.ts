module.exports = class Name {
    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    isRelated = (anotherName: Name): boolean => {
        return (this.firstName === anotherName.firstName && this.lastName === anotherName.lastName);
    };
}