import React from "react";
// import background from "../velzon/assets/images/profile-bg.jpg";
import { UseDetailUser } from "../../Hook/useDetailUser";
import { Spin } from "antd";
const Profile = () => {
  const { data, isLoading } = UseDetailUser();
  if (isLoading) {
    return (
      <Spin
        size="large"
        className="h-[50vh] mt-[100px] flex items-center justify-center w-full "
      />
    );
  }
  return (
    <div className="px-4">
      <div className="profile-foreground position-relative mx-n4 mt-n4">
        <div className="profile-wid-bg">
          {/* <img src={background} alt="" className="profile-wid-img" /> */}
        </div>
      </div>
      <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <div className="row g-4">
          <div className="col-auto">
            <div className="avatar-lg">
              <img
                src={data.avatar}
                alt="user-img"
                className="img-thumbnail rounded-full"
              />
            </div>
          </div>
          {/*end col*/}
          <div className="col">
            <div className="p-2">
              <h3 className="text-white mb-1">{data.name}</h3>
              <p className="text-white text-opacity-75">Admin</p>
            </div>
          </div>
          {/*end col*/}
          <div className="col-12 col-lg-auto order-last order-lg-0">
            <div className="row text text-white-50 text-center">
              <div className="col-lg-6 col-4">
                <div className="p-2">
                  <h4 className="text-white mb-1">24.3K</h4>
                  <p className="fs-14 mb-0">Followers</p>
                </div>
              </div>
              <div className="col-lg-6 col-4">
                <div className="p-2">
                  <h4 className="text-white mb-1">1.3K</h4>
                  <p className="fs-14 mb-0">Following</p>
                </div>
              </div>
            </div>
          </div>
          {/*end col*/}
        </div>
        {/*end row*/}
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div>
            <div className="d-flex profile-wrapper justify-end">
              <div className="flex-shrink-0">
                <a
                  href="pages-profile-settings.html"
                  className="px-3 py-2 rounded-md hover:bg-[#65d7c8] bg-[#0AB39C] flex justify-center items-center gap-2"
                  style={{ color: "white " }}
                >
                  <i className="ri-edit-box-line " />
                  <p>Edit Profile</p>
                </a>
              </div>
            </div>
            {/* Tab panes */}
            <div className="tab-content pt-4 text-muted">
              <div
                className="tab-pane active"
                id="overview-tab"
                role="tabpanel"
              >
                <div className="row">
                  <div className="col-xxl-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-5">
                          Complete Your Profile
                        </h5>
                        <div className="progress rounded-3xl overflow-visible animated-progress custom-progress progress-label">
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: "20%" }}
                            aria-valuenow={30}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div className="label">30%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Info</h5>
                        <div
                          className="table-responsive"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgb(62 127 248) transparent",
                          }}
                        >
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr className="text-[14px]">
                                <th className="ps-0" scope="row">
                                  Full Name :
                                </th>
                                <td className="text-muted">{data.name}</td>
                              </tr>
                              <tr className="text-[14px]">
                                <th className="ps-0" scope="row">
                                  Mobile :
                                </th>
                                <td className="text-muted">{data.phone}</td>
                              </tr>
                              <tr className="text-[14px]">
                                <th className="ps-0" scope="row">
                                  E-mail :
                                </th>
                                <td className="text-muted">{data.email}</td>
                              </tr>

                              <tr className="text-[14px]">
                                <th className="ps-0" scope="row">
                                  Joining Date
                                </th>
                                <td className="text-muted">
                                  {data.date_of_birth}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* end card body */}
                    </div>
                  </div>
                  {/*end col*/}
                  <div className="col-xxl-9">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-3">About</h5>
                        <p>
                          Hi I'm Anna Adame, It will be as simple as Occidental;
                          in fact, it will be Occidental. To an English person,
                          it will seem like simplified English, as a skeptical
                          Cambridge friend of mine told me what Occidental is
                          European languages are members of the same family.
                        </p>
                        <p>
                          You always want to make sure that your fonts work well
                          together and try to limit the number of fonts you use
                          to three or less. Experiment and play around with the
                          fonts that you already have in the software you’re
                          working with reputable font websites. This may be the
                          most commonly encountered tip I received from the
                          designers I spoke with. They highly encourage that you
                          use different fonts in one design, but do not
                          over-exaggerate and go overboard.
                        </p>
                        <div className="row">
                          <div className="col-6 col-md-4">
                            <div className="d-flex mt-4">
                              <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                  <i className="ri-user-2-fill" />
                                </div>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">Designation :</p>
                                <h6 className="text-truncate mb-0">
                                  Lead Designer / Developer
                                </h6>
                              </div>
                            </div>
                          </div>
                          {/*end col*/}
                          <div className="col-6 col-md-4">
                            <div className="d-flex mt-4">
                              <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                  <i className="ri-global-line" />
                                </div>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">Website :</p>
                                <a href="#" className="fw-semibold">
                                  www.velzon.com
                                </a>
                              </div>
                            </div>
                          </div>
                          {/*end col*/}
                        </div>
                        {/*end row*/}
                      </div>
                      {/*end card-body*/}
                    </div>

                    {/* end card */}
                  </div>
                  {/*end col*/}
                </div>
                {/*end row*/}
              </div>

              {/*end tab-pane*/}
            </div>
          </div>
        </div>
        {/*end col*/}
      </div>
    </div>
  );
};

export default Profile;
