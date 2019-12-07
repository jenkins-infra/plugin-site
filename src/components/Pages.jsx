import React, {PropTypes} from 'react';
import Page from './Page';

export default class Pages extends React.PureComponent {

  static propTypes = {
      current: PropTypes.number.isRequired,
      pages: PropTypes.number.isRequired,
      pagesToDisplay: PropTypes.number.isRequired,
      updatePage: PropTypes.func.isRequired
  };

  pageRange() {
      const currentPosition = Math.ceil(this.props.pagesToDisplay / 2);
      const start = this.props.current < currentPosition ? 1
          : this.props.current - currentPosition + 1;
      const len = this.props.pages < start + this.props.pagesToDisplay - 1
          ? this.props.pages - start + 1 : this.props.pagesToDisplay;
      return Array
          .apply(null, Array(len))
          .map((u, i) => start + i);
  }

  render() {
      const pages = this.pageRange().map((page) => {
          const isCurrent = this.props.current == page;
          const className = isCurrent ? 'active' : '';
          const display = isCurrent ? `<span className="sr-only">${page}</span>` : page;
          return (
              <Page key={page} className={className} display={display} isCurrent={isCurrent}
                  page={page} updatePage={this.props.updatePage} />
          );
      });
      const firstPage = this.props.current !== 1 ?
          (<Page key={'Start'} className="start" display='<span aria-hidden="true">&laquo;&laquo;</span>'
              page={1} updatePage={this.props.updatePage} />)
          : null;
      const prevPage = this.props.current > 1 ?
          (<Page key={'Previous'} className="previous" display='<span aria-hidden="true">&laquo;</span>'
              page={this.props.current - 1} updatePage={this.props.updatePage} />)
          : null;
      const nextPage = this.props.current !== this.props.pages ?
          (<Page key={'Next'} className="next" display='<span aria-hidden="true">&raquo;</span>'
              page={this.props.current + 1} updatePage={this.props.updatePage} />)
          : null;
      const lastPage = this.props.current !== this.props.pages ?
          (<Page key={'Last'} className="last" display='<span aria-hidden="true">&raquo;&raquo;</span>'
              page={this.props.current} updatePage={this.props.updatePage} />)
          : null;
      return (
          <ul className="pagination">
              {firstPage}
              {prevPage}
              {pages}
              {nextPage}
              {lastPage}
          </ul>
      );
  }
}
