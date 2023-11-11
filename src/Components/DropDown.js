import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import 'bootstrap/dist/css/bootstrap.min.css';

const animatedComponents = makeAnimated();

class DropDown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, handleChange, isReadOnly, value } = this.props
    return (
      <div className="dropdown">
        <div className="dsdd">
          <div className="dsd"></div>
          <div className="dsds">
            <Select options={data}
              components={animatedComponents}
              onChange={handleChange}
              isMulti={false}
              value={value}
              isReadOnly={isReadOnly}
              >
            </Select>
          </div>
          <div className="col-sm-2"></div>
        </div>
      </div>
    );
  }
}

export default DropDown
