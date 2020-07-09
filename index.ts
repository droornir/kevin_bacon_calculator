import './style.css';
import Name from './Name';
import Address from './Address';

const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>People finder</h1>`;

class Person {
    fullName: Name;
    address: Address;

    computeIsDirectRelated = (aPerson: Person): boolean => {
        return (aPerson.fullName.isRelated(this.fullName) || aPerson.address.isRelated(this.address));
    };

    static staticConstructor = (rawP: any): Person => {
        const p = new Person();
        p.address = new Address(rawP.street, rawP.city);
        p.fullName = new Name(rawP.firstName, rawP.lastName);
        return p;
    };
}

class RelatedPerson extends Person {
    directRelations: RelatedPerson[] = [];

    static createInstance(personA: Person, relatedArr: RelatedPerson[]) {
        const relatedP = new RelatedPerson();
        relatedP.fullName = personA.fullName;
        relatedP.address = personA.address;
        relatedArr.forEach(personRelated => {
            if (personRelated.computeIsDirectRelated(personA)) {
                personRelated.directRelations.push(relatedP);
                relatedP.directRelations.push(personRelated);
            }
        });
        return relatedP;
    }
    isRelated = (anotherP: RelatedPerson): boolean => {
        return this.directRelations.findIndex(aRelated => aRelated === anotherP) >= 0;
    };
}
class Population {
    public relatedPersonsArray: RelatedPerson[] = [];

    init = (aStartingPopulation: Person []) => {
        aStartingPopulation.forEach(aPerson => {
            const newRelatedPerson = RelatedPerson.createInstance(aPerson, this.relatedPersonsArray);
            this.relatedPersonsArray.push(newRelatedPerson);
        });
    };

    FindMinRelationLevel = (aPersonA: RelatedPerson, aPersonB: RelatedPerson): number => {
        return aPersonA.isRelated(aPersonB) ? 1 :
            this.findIndirectRelationLevel(aPersonA, aPersonB, new Array<RelatedPerson>(), 1);
    };

    findIndirectRelationLevel =
        (aPersonA: RelatedPerson, aPersonB: RelatedPerson,
         aCheckedRelatedPersonsArray: RelatedPerson[], aLevel: number): number => {

            const recursivePersonsArray: RelatedPerson[] = [];

            for (let aPersonARelated of aPersonA.directRelations) {
                if (aCheckedRelatedPersonsArray.find(aPersonRelated => aPersonARelated === aPersonRelated)) {
                    continue;
                } else if (aPersonARelated.isRelated(aPersonB)) {
                    return aLevel + 1;
                } else {
                    recursivePersonsArray.push(aPersonARelated);
                }
            }
            const MIN_INT = Number.MIN_SAFE_INTEGER;
            let minLevel = MIN_INT;
            recursivePersonsArray.forEach(relatedP => {
                aCheckedRelatedPersonsArray.push(relatedP);
                const level = this.findIndirectRelationLevel(
                    relatedP, aPersonB, aCheckedRelatedPersonsArray, aLevel + 1);
                if (level < minLevel) {
                    minLevel = level;
                }

            });

            if (minLevel === MIN_INT) {
                minLevel = -1;
            }

            return minLevel;
        };
}
const data = [
    {
        firstName: 'Dror',
        lastName: 'Nir',
        street: 'Megiddo',
        city: 'Tel Aviv'
    },
    {
          firstName: 'Dana',
        lastName: 'Lan',
        street: 'Megiddo',
        city: 'Tel Aviv'
    },
    {
         firstName: 'Dror',
        lastName: 'Nir',
        street: 'Knesset',
        city: 'Jerusalem'
    },
    {
         firstName: 'Offer',
        lastName: 'Nissim',
        street: 'Rashi',
        city: 'Tel Aviv'
    }
];
const personsArray = data.reduce((aPersonsArray: Array<Person>, data: any) => {
    aPersonsArray.push(Person.staticConstructor(data));
    return aPersonsArray;
}, new Array<Person>());

const population = new Population();
population.init(personsArray);

console.log('Test #1 : same address');
console.log('results:', population.FindMinRelationLevel(population.relatedPersonsArray[0], population.relatedPersonsArray[1]));
console.log('Test #2 : same name')
console.log('results:', population.FindMinRelationLevel(population.relatedPersonsArray[0], population.relatedPersonsArray[2]));