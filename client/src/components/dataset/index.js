import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import PropTypes from 'prop-types';

import { connect } from 'react-redux'
import _ from 'lodash'

import selectors from '../../redux/selectors';
import { symbols } from '../../elements'
import StructureContainer from '../../containers/structure'
import { approveDataSet } from '../../redux/ducks/upload';
import { setProgress } from '../../redux/ducks/app';

import PageHead from '../page-head';
import PageBody from '../page-body';

import ValidateTable from './validate';
import EditToggle from './editToggle';

import './index.css'
import { CardActions } from '@material-ui/core';
import { push } from 'connected-react-router';

const tableLabelStyle = {
  fontSize: '18px',
  color: '#9E9E9E'
}

const tableStyle = {
    fontSize: '18px'
  }

const curatorCardStyle = {
  marginTop: '2rem'
}

class Dataset extends Component {

  constructor(props) {
    super(props);
    this.state = {
        approving: false,
        reconstructionMenu: {
          anchor: null,
          open: false
        },
        structureMenu: {
          anchor: null,
          open: false
        },
        projectionMenu: {
          anchor: null,
          open: false
        },
    }
  }

  approve = () => {
    this.props.dispatch(setProgress(true));
    this.props.dispatch(approveDataSet(this.props._id));
    this.setState({
      approving: true
    })
  }

  edit = () => {
    this.props.dispatch(push(`/dataset/${this.props._id}/edit`));
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.public && this.state.approving) {
      this.props.dispatch(setProgress(false));
      this.setState({
        approving: false
      });
    }
  }

  handleClick = (key, anchor) => {
    this.setState({[key]: {anchor: anchor}});
  };

  handleClose = () => {
    this.setState(
      {
        reconstructionMenu:{anchor: null},
        structureMenu: {anchor: null},
        projectionMenu: {anchor: null}
      }
    );
  };

  render = () => {
    const species = this.props.atomicSpecies.map((an) => symbols[an]).join(', ');
    const authors = this.props.authors.join(' and ');

    let isPublic = this.props.public;
    
    let {
      structure, reconstruction, projection, title,
      isCurator, url, _id, editable, isOwner
    } = this.props;

    editable = _.isNil(editable) ? false : editable;


    let structureUrl =  '';
    if (!_.isNil(structure)) {
        structureUrl = `${window.location.origin}/api/v1/mdb/datasets/_/structures/${structure._id}`
    }

    let reconEmdUrl = '';
    let reconTiffUrl = '';
    if (!_.isNil(reconstruction)) {
      reconEmdUrl = `${window.location.origin}/api/v1/mdb/datasets/_/reconstructions/${reconstruction._id}/emd`
      reconTiffUrl = `${window.location.origin}/api/v1/mdb/datasets/_/reconstructions/${reconstruction._id}/tiff`
    }

    let projEmdUrl = '';
    let projTiffUrl = '';
    if (!_.isNil(projection)) {
      projEmdUrl = `${window.location.origin}/api/v1/mdb/datasets/_/projections/${projection._id}/emd`
      projTiffUrl = `${window.location.origin}/api/v1/mdb/datasets/_/projections/${projection._id}/tiff`
    }

    return (
      <div>
        <PageHead>
          <Typography  color="inherit" gutterBottom variant="display1">
            {title}
          </Typography>
          <Typography variant="subheading" paragraph color="inherit">
            {authors}
          </Typography>
        </PageHead>
        <PageBody>
          <Card>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Atomic Species
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      {species}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      License
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <a href={"https://creativecommons.org/licenses/by/4.0/"}>
                        CC BY 4
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      DOI
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <a href={`https://dx.doi.org/${url}`}>
                        {url}
                      </a>
                    </TableCell>
                  </TableRow>
                  { ( !_.isNil(reconstruction) &&
                     (!_.isNil(reconstruction.tiffFileId) ||
                      !_.isNil(reconstruction.emdFileId))
                    ) &&
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Reconstruction
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <IconButton
                        aria-label="More"
                        aria-owns={this.state.reconstructionMenu.anchor ? 'reconstruction-menu' : null}
                        aria-haspopup="true"
                        onClick={(e) => {this.handleClick('reconstructionMenu', e.currentTarget)}}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Menu
                        id="reconstruction-menu"
                        anchorEl={this.state.reconstructionMenu.anchor}
                        open={Boolean(this.state.reconstructionMenu.anchor)}
                        onClose={this.handleClose}
                      >
                        { !_.isNil(reconstruction.tiffFileId) &&
                        <MenuItem
                          value="tiff"
                          onClick={this.handleClose}
                        >
                          <a href={reconTiffUrl}>TIFF</a>
                        </MenuItem>
                        }
                        { !_.isNil(reconstruction.emdFileId) &&
                        <MenuItem
                          value="emd"
                          onClick={this.handleClose}
                        >
                          <a href={reconEmdUrl}>EMD</a>
                        </MenuItem>
                        }
                      </Menu>
                    </TableCell>
                  </TableRow>
                  }
                  { ( !_.isNil(projection) &&
                      (!_.isNil(projection.tiffFileId) ||
                       !_.isNil(projection.emdFileId))
                    ) &&
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Projection
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <IconButton
                        aria-label="More"
                        aria-owns={this.state.projectionMenu.anchor ? 'projection-menu' : null}
                        aria-haspopup="true"
                        onClick={(e) => {this.handleClick('projectionMenu', e.currentTarget)}}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Menu
                        id="projection-menu"
                        anchorEl={this.state.projectionMenu.anchor}
                        open={Boolean(this.state.projectionMenu.anchor)}
                        onClose={this.handleClose}
                      >
                        { !_.isNil(projection.tiffFileId) &&
                        <MenuItem
                          value="tiff"
                          onClick={this.handleClose}
                        >
                          <a href={projTiffUrl}>TIFF</a>
                        </MenuItem>
                        }
                        { !_.isNil(projection.emdFileId) &&
                        <MenuItem
                          value="emd"
                          onClick={this.handleClose}
                        >
                          <a href={projEmdUrl}>EMD</a>
                        </MenuItem>
                        }
                      </Menu>
                    </TableCell>
                  </TableRow>
                  }
                  <TableRow>
                    <TableCell style={{...tableLabelStyle}}>
                      Structure
                    </TableCell>
                    <TableCell style={{...tableStyle}}>
                      <IconButton
                        aria-label="More"
                        aria-owns={this.state.structureMenu.anchor ? 'structure-menu' : null}
                        aria-haspopup="true"
                        onClick={(e) => {this.handleClick('structureMenu', e.currentTarget)}}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Menu
                        id="structure-menu"
                        anchorEl={this.state.structureMenu.anchor}
                        open={Boolean(this.state.structureMenu.anchor)}
                        onClose={this.handleClose}
                      >
                        <MenuItem
                          value="xyz"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/xyz`}>XYZ</a>
                        </MenuItem>
                        <MenuItem
                          value="cjson"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/cjson`}>CJSON</a>
                        </MenuItem>
                        <MenuItem
                          value="cml"
                          onClick={this.handleClose}
                        >
                          <a href={`${structureUrl}/cml`}>CML</a>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div style={{width: '100%', height: '30rem'}}>
                <StructureContainer _id={_id}/>
              </div>
              { !isPublic &&
              <Typography color="textSecondary" style={{flexGrow: 1}}>* This dataset is awaiting approval.</Typography>
              }
            </CardContent>
            { (isCurator || isOwner) &&
            <CardActions style={{display: 'flex'}}>
              <Button
                style={{marginLeft: 'auto'}}
                variant="contained"
                color="primary"
                disabled={!editable && !isCurator}
                onClick={() => this.edit()}
              >
                <EditIcon/>
                Edit
              </Button>
            </CardActions>
            }
          </Card>
          { isCurator &&
          <div style={curatorCardStyle}>
            <Card>
              <CardContent>
                <ValidateTable _id={_id} />
                <EditToggle _id={_id} />
              </CardContent>
              <CardActions style={{display: 'flex'}}>
                { !isPublic &&
                <Button
                  style={{marginLeft: 'auto'}}
                  variant="contained"
                  color="primary"
                  disabled={this.state.approving}
                  onClick={() => this.approve()}
                >
                  <DoneIcon/>
                  Approve
                </Button>
                }
              </CardActions>
            </Card>
          </div>
          }
        </PageBody>
      </div>
    );
  }
}

Dataset.propTypes = {
  _id: PropTypes.string,
  userId: PropTypes.string,
  title: PropTypes.string,
  authors: PropTypes.array,
  imageFileId:  PropTypes.string,
  url:  PropTypes.string,
  isCurator: PropTypes.bool,
  public: PropTypes.bool,
  reconstruction:PropTypes.object,
  projection:PropTypes.object,
  isOwner: PropTypes.bool
}

Dataset.defaultProps = {
  title: '',
  userId: null,
  authors: [],
  imageFileId:  null,
  atomicSpecies: [],
  url: null,
  isCurator: false,
  public: false,
  reconstruction: {},
  projection: {},
  isOwner: false
}


function mapStateToProps(state, ownProps) {
  let props = {};

  if (!_.isNull(ownProps._id)) {
    let structures = selectors.structures.getStructuresById(state);
    if (_.has(structures, ownProps._id)) {
      // For now we only have a single structure, so just pick the first.
      const structure = structures[ownProps._id][0];
      props = {
        structure,
        public: structure.public
      }
    }

    let reconstructions = selectors.reconstructions.getReconstructionsById(state);
    if (_.has(reconstructions, ownProps._id)) {
      // For now we only have a single reconstruction, so just pick the first.
      const reconstruction = reconstructions[ownProps._id][0];
      props = {...props,
        reconstruction
      }

      if (_.has(reconstruction, 'emdFileId')) {
        props['emdFileId'] = reconstruction.emdFileId
      }

      if (_.has(reconstruction, 'tiffFileId')) {
        props['tiffFileId'] = reconstruction.tiffFileId
      }
    }

    let projections = selectors.projections.getProjectionsById(state);
    if (_.has(projections, ownProps._id)) {
      // For now we only have a single projection, so just pick the first.
      const projection = projections[ownProps._id][0];
      props = {...props,
        projection
      }

      if (_.has(projection, 'emdFileId')) {
        props['emdFileId'] = projection.emdFileId
      }

      if (_.has(projection, 'tiffFileId')) {
        props['tiffFileId'] = projection.tiffFileId
      }
    }
  }

  const me = selectors.girder.getMe(state);

  const curatorGroup = selectors.girder.getCuratorGroup(state);
  if (!_.isNil(curatorGroup)) {
    if (!_.isNil(me)) {
      props['isCurator'] = _.includes(me.groups, curatorGroup['_id'])
    }
  }

  if (!_.isNil(me)) {
    if (me._id === ownProps.userId) {
      props['isOwner'] = true;
    }
  }

  return props;
}

export default connect(mapStateToProps)(Dataset)
