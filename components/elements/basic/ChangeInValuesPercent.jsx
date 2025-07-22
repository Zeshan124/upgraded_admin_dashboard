  import {
  ArrowDownOutlined,
  ArrowUpOutlined,

} from "@ant-design/icons";


export default function ChangeInValuesPercent  ({current, previous}){
    if (previous === null || previous === undefined) return null;

    if (previous === 0) {
        if (current === 0) return null; 
        return (
            <div style={{ color: 'green', fontSize: '10px', marginLeft: '3px' }}>
                <ArrowUpOutlined /> New
            </div>
        );
    }

    const percentChange = ((current - previous) / previous) * 100;
    const isPositive = percentChange > 0;
    const color = percentChange === 0 ? '#8c8c8c' : (isPositive ? 'green' : 'red');
    const Icon = percentChange === 0 ? null : (isPositive ? ArrowUpOutlined : ArrowDownOutlined);

    return (
        <div style={{ color, fontSize: '10px', marginLeft: '3px' }}>
            {Icon && <Icon />} {Math.abs(percentChange).toFixed(1)}%
        </div>
    );
  };
