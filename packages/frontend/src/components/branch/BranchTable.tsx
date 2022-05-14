import { Branch } from '@components/branch/BranchBoard';
import { BranchRow } from '@components/branch/BranchRow';
import { Sorting } from '@components/SortingButton';

type BranchTableProp = {
  branches: Branch[],
  sortBy: Sorting,
};

export const BranchTable = ({
  branches,
  sortBy
}: BranchTableProp) => {
  return (
    <div className="overflow-x-auto rounded-md">
      <table className="w-full">
        <tbody className="space-y-4 divide">
          {branches.length !== 0 && branches.sort(sortBy.sort).map((branch, index) => (
            <BranchRow
              key={branch.branchId}
              id={branch.branchId.toString()}
              managerName={branch.managerName}
              address={branch.address}
              pendingTicket={Math.floor(Math.random() * 100)}
              last={index === branches.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
