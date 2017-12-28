export class Specialty {
    constructor(
        public id: number,
        public name: string
    ){}

    static empty() : Specialty {
        return new Specialty(null, '');
    }
}

export class SpecialtyStatistic {
    constructor(
        public patientId: number,
        public statisticInfo: string
    ){}
}