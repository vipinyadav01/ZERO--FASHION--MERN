import PropTypes from 'prop-types';

/**
 * Shared page wrapper — consistent background, max-width, spacing
 */
const PageShell = ({ children }) => (
    <div className="min-h-screen bg-[#F8F8F6] font-sans">
        <div className="max-w-[1600px] mx-auto p-5 lg:p-7 space-y-5">
            {children}
        </div>
    </div>
);

PageShell.propTypes = { children: PropTypes.node.isRequired };

export default PageShell;
