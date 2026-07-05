import { uid } from '@/lib/utils'

export const UNIT_OPTIONS = ['cft', 'sft', 'cum', 'sqm', 'rft', 'rm', 'kg', 'ton', 'nos', 'ls', 'bag']

export const BOQ_CATEGORIES = [
  'Earthwork',
  'Concrete',
  'Reinforcement',
  'Masonry',
  'Finishing',
  'Plumbing',
  'Electrical',
  'Miscellaneous',
]

function item(description, category, unit, quantity, rate) {
  return { id: uid('boq'), description, category, unit, quantity, rate }
}

export function seedProjects() {
  return [
    {
      id: uid('prj'),
      name: 'Green Valley Residence',
      location: 'Bashundhara R/A, Dhaka',
      client: 'Mr. Rahman Khan',
      startDate: '2025-01-15',
      endDate: '2025-11-30',
      status: 'ongoing',
      createdAt: '2025-01-10',
      boq: [
        item('Earth excavation for foundation', 'Earthwork', 'cum', 320, 280),
        item('RCC work (1:2:4) for footing & column', 'Concrete', 'cft', 4200, 420),
        item('MS reinforcement 60 grade', 'Reinforcement', 'kg', 18500, 95),
        item('125mm brick work in cement mortar', 'Masonry', 'sft', 9800, 92),
        item('Plaster work 12mm thick', 'Finishing', 'sft', 21500, 38),
        item('Floor tiles (600x600) with fixing', 'Finishing', 'sft', 6400, 165),
      ],
      cost: { laborCost: 2650000, miscCost: 480000, profitPercent: 12, vatPercent: 7.5 },
    },
    {
      id: uid('prj'),
      name: 'Riverside Commercial Tower',
      location: 'Motijheel C/A, Dhaka',
      client: 'Meghna Group Ltd.',
      startDate: '2025-03-01',
      endDate: '2027-02-28',
      status: 'planning',
      createdAt: '2025-02-05',
      boq: [
        item('Pile foundation 600mm dia', 'Concrete', 'rm', 2400, 3200),
        item('RCC work (1:1.5:3) superstructure', 'Concrete', 'cft', 32000, 480),
        item('MS reinforcement 500W', 'Reinforcement', 'ton', 210, 92000),
        item('Curtain wall glazing', 'Finishing', 'sft', 18000, 1250),
        item('Fire fighting & plumbing works', 'Plumbing', 'ls', 1, 8500000),
      ],
      cost: { laborCost: 18500000, miscCost: 4200000, profitPercent: 15, vatPercent: 7.5 },
    },
    {
      id: uid('prj'),
      name: 'Sunrise Apartment Renovation',
      location: 'Dhanmondi, Dhaka',
      client: 'Mrs. Ferdousi Begum',
      startDate: '2024-09-10',
      endDate: '2025-01-20',
      status: 'completed',
      createdAt: '2024-08-15',
      boq: [
        item('Demolition of existing partitions', 'Miscellaneous', 'sft', 1200, 45),
        item('New brick partition 125mm', 'Masonry', 'sft', 900, 92),
        item('Wall putty & weather coat paint', 'Finishing', 'sft', 5600, 42),
        item('Electrical rewiring', 'Electrical', 'ls', 1, 350000),
        item('Modular kitchen & cabinets', 'Finishing', 'nos', 2, 185000),
      ],
      cost: { laborCost: 620000, miscCost: 95000, profitPercent: 10, vatPercent: 7.5 },
    },
  ]
}

// Monthly progress used by the dashboard bar chart (BDT, in lakh scale handled by chart)
export const MONTHLY_PROGRESS = [
  { month: 'Jan', planned: 4200000, completed: 3800000 },
  { month: 'Feb', planned: 5100000, completed: 4600000 },
  { month: 'Mar', planned: 6300000, completed: 5900000 },
  { month: 'Apr', planned: 5800000, completed: 6100000 },
  { month: 'May', planned: 7200000, completed: 6800000 },
  { month: 'Jun', planned: 8100000, completed: 7400000 },
]
