//  Profile Data
interface MiniiconsType {
  id: number;
  icon: string;
  tooltip: string;
}

const Miniicons: MiniiconsType[] = [
  {
    id: 1,
    icon: 'solar:layers-line-duotone',
    tooltip: 'Dashboards',
  },
  {
    id: 2,
    icon: 'solar:mirror-left-line-duotone',
    tooltip: 'Master',
  },
  {
    id: 3,
    icon: 'solar:quit-pip-outline',
    tooltip: 'UI Kit',
  },
];

export default Miniicons;
