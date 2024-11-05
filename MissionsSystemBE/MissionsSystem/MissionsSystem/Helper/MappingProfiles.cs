using AutoMapper;
using MissionsSystem.Dto;
using MissionsSystem.Models;
using System.Diagnostics.Metrics;

namespace MissionsSystem.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<OfficersTbl, OfficersTblDto>();
            CreateMap<OfficersTblDto, OfficersTbl>();
            CreateMap<MissionTbl, MissionTblDto>();
            CreateMap<MissionTblDto, MissionTbl>();
            CreateMap<UsersTbl, UsersTblDto>();
            CreateMap<UsersTblDto, UsersTbl>();
            CreateMap<UserHistoryDto, UserHistory>();
            CreateMap<UserHistory, UserHistoryDto>();
            CreateMap<AuthenticationsTbl, AuthenticationsTblDto>();
            CreateMap<AuthenticationsTblDto, AuthenticationsTbl>();
        }
    }
}
