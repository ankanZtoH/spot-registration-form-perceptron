export type Event = {
  id: string;
  name: string;
  day: 'Day 1' | 'Day 2';
  totalSpots: number;
  registeredCount: number;
  extraRegistrations: number;
};

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'd1-e1',
    name: 'Asimov Circuit (Robotics Competition)',
    day: 'Day 1',
    totalSpots: 50,
    registeredCount: 45,
    extraRegistrations: 0,
  },
  {
    id: 'd1-e2',
    name: 'The Cascade Challenge (Puzzle Competition)',
    day: 'Day 1',
    totalSpots: 30,
    registeredCount: 10,
    extraRegistrations: 0,
  },
  {
    id: 'd1-e3',
    name: 'Knight Vision (Chess Competition)',
    day: 'Day 1',
    totalSpots: 30,
    registeredCount: 10,
    extraRegistrations: 0,
  },
  {
    id: 'd1-e4',
    name: 'Riddle Run (Treasure Hunt)',
    day: 'Day 1',
    totalSpots: 30,
    registeredCount: 10,
    extraRegistrations: 0,
  },
  {
    id: 'd2-e1',
    name: 'The Final Bid (Cricket Auction)',
    day: 'Day 2',
    totalSpots: 20,
    registeredCount: 18,
    extraRegistrations: 0,
  },
  {
    id: 'd2-e2',
    name: 'Funda Mania (Quiz Competition)',
    day: 'Day 2',
    totalSpots: 100,
    registeredCount: 80,
    extraRegistrations: 0,
  },
  {
    id: 'd2-e3',
    name: 'The Turing Show (Coding Competition)',
    day: 'Day 2',
    totalSpots: 20,
    registeredCount: 18,
    extraRegistrations: 0,
  },
  {
    id: 'd2-e4',
    name: 'Dhristikon (Photography Competition)',
    day: 'Day 2',
    totalSpots: 20,
    registeredCount: 18,
    extraRegistrations: 0,
  }
];
